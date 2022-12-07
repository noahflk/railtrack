import { setCookie } from 'cookies-next';
import { z } from 'zod';

import { LANG_COOKIE_KEY } from '@/constants';
import { protectedProcedure, router } from '@/server/trpc';

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
  invalidateLanguage: protectedProcedure.mutation(async ({ ctx }) => {
    // this means we haven't set the cookie
    // so now we fetch settings and check there.
    const settings = await ctx.prisma.settings.findUnique({ where: { userId: ctx.user.id } });

    // and if it's there, store in cookie and use it
    if (settings?.language) {
      setCookie(LANG_COOKIE_KEY, settings?.language, { ...ctx, sameSite: 'lax' });

      return settings?.language;
    }

    // if we also have nothing in the DB, just use the browser language
    // set the language selection to browser from now on
    // this prevents us from having to make a DB query each time
    setCookie(LANG_COOKIE_KEY, 'browser', { ...ctx, sameSite: 'lax' });

    return 'browser';
  }),
});
