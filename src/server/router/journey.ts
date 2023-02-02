import type { Section } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import axios from 'axios';
import { isBefore, subMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { z } from 'zod';

import { APP_TIMEZONE, DUPLICATE_JOURNEY, TRANSPORT_API_URL } from '@/constants';
import { protectedProcedure, router } from '@/server/trpc';
import type { JourneyIdentifier } from '@/types/journey';
import type { Journey } from '@/types/opendata';
import { calculateJourneyDistance } from '@/utils/calculateDistance';
import { parseDurationString } from '@/utils/duration';
import { hashJourneyIdentifier } from '@/utils/journeyIdentifier';
import { log } from '@/utils/logger';
import { roundToOneDecimal } from '@/utils/rounding';

type StationInformation = {
  name: string;
  time: Date;
};

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
  const bufferedTime = subMinutes(new Date(departureTime), 10);
  const localBufferedDate = formatInTimeZone(bufferedTime, APP_TIMEZONE, 'yyyy-MM-dd');
  const localBufferedTime = formatInTimeZone(bufferedTime, APP_TIMEZONE, 'HH:mm');

  const { data } = await axios.get<{ connections: Journey[] }>(
    `${TRANSPORT_API_URL}/connections?from=${departureStation}&to=${arrivalStation}&date=${localBufferedDate}&time=${localBufferedTime}&limit=10`
  );

  // ensure we have the desired connection by comparing departure time and platform
  return data.connections.find(
    (connection) => connection.from.platform === platform && connection.from.departure === departureTime
  );
};

const getDepartureStation = (sections: Section[]): StationInformation => {
  // sort sections array by departureTime property that's on each element
  // the departure of a journey is the departure_station_name of the earliest section
  sections.sort((sectionA, sectionB) => {
    const dateA = sectionA.departureTime;
    const dateB = sectionB.departureTime;

    if (isBefore(dateA, dateB)) return -1;
    if (isBefore(dateB, dateA)) return 1;

    return 0;
  });

  return {
    name: sections[0]?.departureStation || '',
    time: sections[0]?.departureTime || new Date(),
  };
};

const getArrivalStation = (sections: Section[]): StationInformation => {
  sections.sort((sectionA, sectionB) => {
    const dateA = new Date(sectionA.departureTime);
    const dateB = new Date(sectionB.departureTime);

    if (isBefore(dateA, dateB)) return 1;
    if (isBefore(dateB, dateA)) return -1;

    return 0;
  });

  return {
    name: sections[0]?.arrivalStation || '',
    time: sections[0]?.arrivalTime || new Date(),
  };
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
          identifier,
        },
      });

      logAddJourney(ctx.user.email, input.departureStation, input.arrivalStation);

      return { success: true };
    }),
  get: protectedProcedure.input(z.optional(z.number())).query(async ({ ctx, input }) => {
    const journeys = await ctx.prisma.journey.findMany({
      where: {
        userId: ctx.user.id,
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
    const enrichedJourneys = journeys.map((journey) => {
      const departureStation = getDepartureStation(journey.sections);
      const arrivalStation = getArrivalStation(journey.sections);

      return {
        ...journey,
        departureStation: departureStation.name,
        arrivalStation: arrivalStation.name,
        departureTime: departureStation.time,
        arrivalTime: arrivalStation.time,
        stops: journey.sections.length - 1,
        distance: roundToOneDecimal(calculateJourneyDistance(journey.sections)),
      };
    });

    // sort journeys by departure time
    const sortedJourneys = enrichedJourneys.sort((journeyA, journeyB) => {
      if (isBefore(journeyA.departureTime, journeyB.departureTime)) return -1;
      if (isBefore(journeyB.departureTime, journeyA.departureTime)) return 1;

      return 0;
    });

    if (input) {
      return sortedJourneys.slice(-input);
    }

    return sortedJourneys;
  }),
  getOne: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const journey = await ctx.prisma.journey.findUnique({
      where: {
        id: input,
      },
      include: {
        sections: {
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

    const departureStation = getDepartureStation(journey.sections);
    const arrivalStation = getArrivalStation(journey.sections);

    return {
      ...journey,
      departureStation: departureStation.name,
      arrivalStation: arrivalStation.name,
      departureTime: departureStation.time,
      arrivalTime: arrivalStation.time,
      stops: journey.sections.length - 1,
      distance: roundToOneDecimal(calculateJourneyDistance(journey.sections)),
    };
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
          id: 'asc',
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

      const journeyList = journeys.map((journey) => {
        const departureStation = getDepartureStation(journey.sections);
        const arrivalStation = getArrivalStation(journey.sections);

        return {
          ...journey,
          departureStation: departureStation.name,
          arrivalStation: arrivalStation.name,
          departureTime: departureStation.time,
          arrivalTime: arrivalStation.time,
          stops: journey.sections.length - 1,
          distance: roundToOneDecimal(calculateJourneyDistance(journey.sections)),
        };
      });
      return {
        journeyList,
        nextCursor,
      };
    }),
  singleJourneyStats: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const journey = await ctx.prisma.journey.findUnique({
      where: {
        id: input,
      },
      select: {
        userId: true,
        duration: true,
        sections: {
          select: {
            passes: {
              select: {
                stationCoordinateX: true,
                stationCoordinateY: true,
                stationName: true,
              },
            },
          },
        },
      },
    });

    // return not found if journey does not exist
    if (!journey || journey.userId !== ctx.user.id) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Journey not found' });
    }

    const distance = calculateJourneyDistance(journey.sections);

    const coordinates = [{ sections: journey.sections }];

    return {
      distance: roundToOneDecimal(distance),
      count: journey.sections.length + 1,
      coordinates,
      duration: roundToOneDecimal(journey.duration / 60),
    };
  }),
  stats: protectedProcedure.query(async ({ ctx }) => {
    const journeys = await ctx.prisma.journey.findMany({
      where: {
        userId: ctx.user.id,
      },
      select: {
        sections: {
          select: {
            passes: {
              select: {
                stationCoordinateX: true,
                stationCoordinateY: true,
                stationName: true,
              },
            },
          },
        },
      },
    });

    const distance = journeys.reduce((partial, journey) => partial + calculateJourneyDistance(journey.sections), 0);

    const numberOfJourneys = await ctx.prisma.journey.count({
      where: {
        userId: ctx.user.id,
      },
    });

    const durationResult = await ctx.prisma.$queryRaw<
      { sum: bigint }[]
    >`SELECT sum(duration) FROM "Journey" WHERE "userId" = ${ctx.user.id}`;

    const durationInMinutes = Number(durationResult[0]?.sum);

    return {
      distance: roundToOneDecimal(distance),
      count: numberOfJourneys,
      coordinates: journeys,
      duration: roundToOneDecimal(durationInMinutes / 60),
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
