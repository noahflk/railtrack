import { formatInTimeZone } from 'date-fns-tz';

export function formatDateTime(timestamp: number, format: string): string {
  return formatInTimeZone(new Date(timestamp * 1000), 'Europe/Zurich', format);
}
