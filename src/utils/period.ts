import { startOfToday, subDays, subMonths, subYears } from 'date-fns';

import type { Period } from '@/types/period';

export const getStartDate = (period: Period) => {
  if (period === 'all') {
    return undefined;
  }

  if (period === 'week') {
    return subDays(startOfToday(), 7);
  }

  if (period === 'month') {
    return subMonths(startOfToday(), 1);
  }

  if (period === 'year') {
    return subYears(startOfToday(), 1);
  }

  throw new Error(`Invalid period: ${period}`);
};
