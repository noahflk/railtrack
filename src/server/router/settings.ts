import { z } from 'zod';

import { createProtectedRouter } from '@/server/router/protected';

export const settingsRouter = createProtectedRouter()
  .query('get', {
    async resolve({ ctx }) {
      // there might be no settings for this user yet
      return await ctx.prisma.settings.findUnique({ where: { userId: ctx.user.id } });
    },
  })
  .mutation('set-language', {
    input: z.enum(['en', 'de']),
    async resolve({ ctx, input }) {
      const settings = await ctx.prisma.settings.findUnique({ where: { userId: ctx.user.id } });

      if (!settings) {
        return await ctx.prisma.settings.create({
          data: {
            userId: ctx.user.id,
            language: input,
          },
        });
      }

      return await ctx.prisma.settings.update({
        where: { userId: ctx.user.id },
        data: { language: input },
      });
    },
  });
