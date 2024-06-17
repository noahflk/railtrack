import { Prisma } from '@prisma/client';
import { endOfYear, startOfToday, startOfYear, subDays, subMonths, subYears } from 'date-fns';

import { YearAsString, type Period } from '@/types/period';

type MetricPeriod = {
  gte: Date;
  lte: Date | undefined;
};

export const dateRangeCondition = (period: MetricPeriod | undefined) => {
  if (!period) {
    return Prisma.empty;
  }

  if (period.gte && period.lte) {
    return Prisma.sql`AND "departureTime" >= ${period.gte} AND "departureTime" <= ${period.lte}`;
  }

  if (period.gte) {
    return Prisma.sql`AND "departureTime" >= ${period.gte}`;
  }

  if (period.lte) {
    return Prisma.sql`AND "departureTime" <= ${period.lte}`;
  }

  return Prisma.empty;
};

export const getStartAndEndDate = (period: Period): MetricPeriod | undefined => {
  if (period === 'all') {
    return undefined;
  }

  if (period === 'week') {
    return {
      gte: subDays(startOfToday(), 7),
      lte: undefined,
    };
  }

  if (period === 'month') {
    return {
      gte: subMonths(startOfToday(), 1),
      lte: undefined,
    };
  }

  if (period === 'year') {
    return {
      gte: subYears(startOfToday(), 1),
      lte: undefined,
    };
  }

  const result = YearAsString.safeParse(period);

  if (result.success) {
    const year = parseInt(result.data, 10); // Convert valid string to number
    const start = startOfYear(new Date(year, 0, 1)); // January 1 of the year
    const end = endOfYear(new Date(year, 0, 1)); // December 31 of the year

    return {
      gte: start,
      lte: end,
    };
  }

  // If the period does not match any case, throw an error
  throw new Error(`Invalid period: ${period}`);
};

export const getStartDate = (period: Period): Date => getStartAndEndDate(period)?.gte || startOfToday();
