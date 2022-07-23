import { z } from 'zod';

import { createRouter } from '@/server/router/context';

export const journeyRouter = createRouter()
  .query('add', {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? 'world'}`,
      };
    },
  })
  .query('getAll', {
    async resolve({ ctx }) {
      return await ctx.prisma.example.findMany();
    },
  });
