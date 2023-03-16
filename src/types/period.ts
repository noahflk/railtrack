import { z } from 'zod';

export const ZodPeriod = z.enum(['all', 'week', 'month', 'year']);

export type Period = z.infer<typeof ZodPeriod>;

export type CountInPeriod = {
  label: string;
  value: number;
};
