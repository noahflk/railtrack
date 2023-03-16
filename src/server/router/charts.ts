import { calculateJourneyDistance } from '@/utils/calculateDistance';
import { PrismaClient } from '@prisma/client';
import { format, isEqual, startOfMonth, sub } from 'date-fns';

import { protectedProcedure, router } from '@/server/trpc';
import { CountInPeriod, ZodPeriod, type Period } from '@/types/period';
import { getStartDate } from '@/utils/period';

const getJourneyCountForPeriod = async (prisma: PrismaClient, period: Period, userId: string) => {
  const notBeforeDate = getStartDate(period);

  if (period === 'year') {
    return await (prisma.$queryRaw`
        SELECT DATE_TRUNC('month', "departureTime") AS "label",
        COUNT("departureTime") AS "value" FROM "Journey"
        WHERE "departureTime" >= ${notBeforeDate}
        AND "userId"=${userId}
        GROUP BY DATE_TRUNC('month', "departureTime")
        ORDER BY DATE_TRUNC('month', "departureTime");
      ` as Promise<CountInPeriod[]>);
  }

  // period is week or month
  return await (prisma.$queryRaw`
    SELECT DATE_TRUNC('day', "departureTime") AS "label",
    COUNT("departureTime") AS "value" FROM "Journey"
    WHERE "departureTime" >= ${notBeforeDate}
    AND "userId"=${userId}
    GROUP BY DATE_TRUNC('day', "departureTime")
    ORDER BY DATE_TRUNC('day', "departureTime");
  ` as Promise<CountInPeriod[]>);
};

const getDistanceForPeriod = async (prisma: PrismaClient, period: Period, days: string[], userId: string) => {
  const notBeforeDate = getStartDate(period);

  const journeys = await prisma.journey.findMany({
    where: {
      userId,
      departureTime: {
        gte: notBeforeDate,
      },
    },
    select: {
      userId: true,
      duration: true,
      departureTime: true,
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

  if (!journeys) return [];

  return days.map((day) => {
    // find journeys that are in this day
    const journeysInDay = journeys.filter((journey) => format(journey.departureTime, 'yyyy-MM-dd') === day);

    // sum up the distance
    const distancePerDay = journeysInDay.reduce((acc, journey) => acc + calculateJourneyDistance(journey.sections), 0);

    return {
      label: day,
      value: distancePerDay,
    };
  });
};

const getLast7DaysTimestamps = (): string[] => {
  const result: string[] = [];
  let date = new Date();

  for (let day = 6; day >= 0; day--) {
    const newDate = sub(date, { days: day });
    result.push(format(newDate, 'yyyy-MM-dd'));
  }

  return result;
};

const getLast30DaysTimestamps = (): string[] => {
  const result: string[] = [];

  let date = new Date();

  for (let day = 29; day >= 0; day--) {
    const newDate = sub(date, { days: day });
    result.push(format(newDate, 'yyyy-MM-dd'));
  }

  return result;
};

const getLastYearTimestamps = (): string[] => {
  const result: string[] = [];

  let date = startOfMonth(new Date());

  for (let month = 11; month >= 0; month--) {
    const newDate = sub(date, { months: month });
    result.push(format(newDate, 'yyyy-MM-dd'));
  }

  return result;
};

const getJourneysForDay = (day: string, days: CountInPeriod[]): number => {
  const dayDate = new Date(day);

  const matchedDay = days.find((day) => {
    const labelDate = new Date(day.label);

    return isEqual(dayDate, labelDate);
  });

  if (matchedDay) return Number(matchedDay.value);

  return 0;
};

const getJourneysInPeriod = async (prisma: PrismaClient, period: Period, userId: string) => {
  const journeyCount = await getJourneyCountForPeriod(prisma, period, userId);

  if (period === 'week') {
    const days = getLast7DaysTimestamps();

    return days.map((date) => {
      return {
        label: date,
        value: getJourneysForDay(date, journeyCount),
      };
    });
  }

  if (period === 'month') {
    const days = getLast30DaysTimestamps();

    return days.map((date) => {
      return {
        label: date,
        value: getJourneysForDay(date, journeyCount),
      };
    });
  }

  // Last case is implicitly year
  const months = getLastYearTimestamps();

  return months.map((date) => ({ label: date, value: getJourneysForDay(date, journeyCount) }));
};

const getDistanceInPeriod = async (prisma: PrismaClient, period: Period, userId: string) => {
  let days: string[];

  if (period === 'week') {
    days = getLast7DaysTimestamps();
  } else if (period === 'month') {
    days = getLast30DaysTimestamps();
  } else {
    days = getLastYearTimestamps();
  }

  return getDistanceForPeriod(prisma, period, days, userId);
};

export const chartsRouter = router({
  getPeriodCharts: protectedProcedure.input(ZodPeriod).query(async ({ ctx, input }) => {
    const journeyCount = await getJourneysInPeriod(ctx.prisma, input, ctx.user.id);
    const distanceCount = await getDistanceInPeriod(ctx.prisma, input, ctx.user.id);

    return { journeyCount, distanceCount };
  }),
});
