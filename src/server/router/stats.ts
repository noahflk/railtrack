import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { protectedProcedure, router } from '@/server/trpc';
import { calculateJourneyDistance } from '@/utils/calculateDistance';
import { roundToOneDecimal } from '@/utils/rounding';

export const statsRouter = router({
  getOne: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const journey = await ctx.prisma.journey.findFirst({
      where: {
        uuid: input,
        userId: ctx.user.id,
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
      // number of stops
      count: journey.sections.length - 1,
      coordinates,
      duration: roundToOneDecimal(journey.duration / 60),
    };
  }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
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
});
