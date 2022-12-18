import { formatInTimeZone } from 'date-fns-tz';

import { APP_TIMEZONE } from '@/constants';

export function formatDateTime(timestamp: number, format: string): string {
  return formatInTimeZone(new Date(timestamp * 1000), APP_TIMEZONE, format);
}
