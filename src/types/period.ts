import { z } from 'zod';

export const ZodPeriod = z.enum(['all', 'week', 'month', 'year']);

export type Period = z.infer<typeof ZodPeriod>;
