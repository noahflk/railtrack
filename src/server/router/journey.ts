import { TRPCError } from '@trpc/server';
import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';
import { z } from 'zod';

import { APP_TIMEZONE, DUPLICATE_JOURNEY, TRANSPORT_API_URL } from '@/constants';
import { protectedProcedure, router } from '@/server/trpc';
import type { JourneyIdentifier } from '@/types/journey';
import type { Journey } from '@/types/opendata';
import { parseDurationString } from '@/utils/duration';
import { populateJourney } from '@/utils/journey';
import { hashJourneyIdentifier } from '@/utils/journeyIdentifier';
import { log } from '@/utils/logger';

const logAddJourney = (email: string | undefined, from: string, to: string) => {
  log({
    channel: 'add-journey',
    event: 'User added journey',
    description: `from ${from} to ${to}`,
    icon: '🚝',
    tags: {
      email: email,
    },
    notify: false,
  });
};

const findConnection = async ({
  departureStation,
  arrivalStation,
  departureTime,
  platform,
}: JourneyIdentifier): Promise<Journey | undefined> => {
  const localDate = formatInTimeZone(new Date(departureTime), APP_TIMEZONE, 'yyyy-MM-dd');
  const localTime = formatInTimeZone(new Date(departureTime), APP_TIMEZONE, 'HH:mm');

  const { data } = await axios.get<{ connections: Journey[] }>(
    `${TRANSPORT_API_URL}/connections?from=${departureStation}&to=${arrivalStation}&date=${localDate}&time=${localTime}&limit=10`
  );

  // ensure we have the desired connection by comparing departure time and platform
  return data.connections.find(
    (connection) => connection.from.platform === platform && connection.from.departure === departureTime
  );
};

export const journeyRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        departureStation: z.string(),
        arrivalStation: z.string(),
        departureTime: z.string(),
        platform: z.nullable(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const journey = await findConnection(input);

      if (!journey) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Journey not found' });
      }

      // store the hashed journey identifier so that we can easily check for duplicate journeys
      const identifier = hashJourneyIdentifier({
        departureStation: input.departureStation,
        arrivalStation: input.arrivalStation,
        departureTime: input.departureTime,
        platform: input.platform,
      });

      // check if same user already has this journey
      const existingJourney = await ctx.prisma.journey.findFirst({
        where: {
          identifier,
          userId: ctx.user.id,
        },
      });

      if (existingJourney) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: DUPLICATE_JOURNEY });
      }

      const sections = journey.sections.filter((section) => section.journey);

      // create structured data for journey to save it
      const sectionsData = sections.flatMap((section) => {
        // ensure we only include sections that have a journey
        if (!section.journey) return [];

        const passes = section.journey.passList.map((pass) => ({
          arrivalTime: new Date(pass.arrival),
          departureTime: new Date(pass.departure),
          stationName: pass.station.name,
          stationCoordinateX: pass.station.coordinate.x,
          stationCoordinateY: pass.station.coordinate.y,
        }));

        return {
          departureTime: new Date(section.departure.departure),
          arrivalTime: new Date(section.arrival.arrival),
          departureStation: section.departure.station.name,
          departureStationCoordinateX: section.departure.station.coordinate.x,
          departureStationCoordinateY: section.departure.station.coordinate.y,
          arrivalStation: section.arrival.station.name,
          arrivalStationCoordinateX: section.arrival.station.coordinate.x,
          arrivalStationCoordinateY: section.arrival.station.coordinate.y,
          destination: section.journey?.to,
          trainOperator: section.journey?.operator,
          trainNumber: section.journey?.number,
          trainCategory: section.journey?.category,
          passes: {
            create: passes,
          },
        };
      });

      await ctx.prisma.journey.create({
        data: {
          duration: parseDurationString(journey.duration),
          userId: ctx.user.id,
          sections: {
            create: sectionsData,
          },
          departureTime: new Date(journey.from.departure),
          identifier,
        },
      });

      logAddJourney(ctx.user.email, input.departureStation, input.arrivalStation);

      return { success: true };
    }),
  get: protectedProcedure.input(z.optional(z.number())).query(async ({ ctx, input: limit }) => {
    const journeys = await ctx.prisma.journey.findMany({
      where: {
        userId: ctx.user.id,
      },
      // if limit is present, only take n recent journeys
      take: limit,
      orderBy: {
        departureTime: 'desc',
      },
      include: {
        sections: {
          include: {
            passes: true,
          },
        },
      },
    });

    // enhance journey with more info
    return journeys.map(populateJourney);
  }),
  getOne: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const journey = await ctx.prisma.journey.findFirst({
      where: {
        uuid: input,
        userId: ctx.user.id,
      },
      include: {
        sections: {
          orderBy: {
            departureTime: 'desc',
          },
          include: {
            passes: true,
          },
        },
      },
    });

    // return not found if journey does not exist
    if (!journey || journey.userId !== ctx.user.id) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Journey not found' });
    }

    return populateJourney(journey);
  }),
  getInfinite: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const { cursor } = input;

      const journeys = await ctx.prisma.journey.findMany({
        take: limit + 1,
        where: {
          userId: ctx.user.id,
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          departureTime: 'desc',
        },
        include: {
          sections: {
            include: {
              passes: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (journeys.length > limit) {
        const nextItem = journeys.pop();
        nextCursor = nextItem?.id;
      }

      const journeyList = journeys.map(populateJourney);

      return {
        journeyList,
        nextCursor,
      };
    }),
  delete: protectedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    // check if journey exists and belongs to user
    const journey = await ctx.prisma.journey.findFirst({
      where: {
        id: input,
        userId: ctx.user.id,
      },
    });

    if (!journey) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Journey not found' });
    }

    // actually delete the journey
    await ctx.prisma.journey.delete({
      where: {
        id: input,
      },
    });

    return { success: true };
  }),
});
