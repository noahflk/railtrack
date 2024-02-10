import { z } from 'zod';

// Define a Zod schema for a string that represents a year (a number as a string)
export const YearAsString = z.string().regex(/^\d{4}$/, 'Must be a 4-digit year string');

const ZodNormalPeriod = z.enum(['all', 'week', 'month', 'year']);
export const ZodPeriod = z.union([ZodNormalPeriod, YearAsString]);

export type Period = z.infer<typeof ZodPeriod>;

export type CountInPeriod = {
  label: string;
  value: number;
};
