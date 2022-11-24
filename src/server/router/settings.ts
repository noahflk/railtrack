import { z } from 'zod';

import { router, protectedProcedure } from '@/server/trpc';

export const settingsRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.settings.findUnique({ where: { userId: ctx.user.id } });
  }),
  setLanguage: protectedProcedure.input(z.enum(['en', 'de'])).mutation(async ({ ctx, input }) => {
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
  }),
});
