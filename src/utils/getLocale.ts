import parser from 'accept-language-parser';
import { getCookie, setCookie } from 'cookies-next';

import { DEFAULT_LANG, LANG_COOKIE_KEY, SUPPORTED_LANGS } from '@/constants';
import { prisma } from '@/server/db/client';
import type { Context } from '@/types/context';
import { getUserFromContext } from '@/utils/serverUser';

const getBrowserLanguage = (ctx: Context) => {
  const languages = ctx.req.headers['accept-language'];

  // use english as the default
  return parser.pick(SUPPORTED_LANGS, languages ?? '', { loose: true }) ?? DEFAULT_LANG;
};

export const getLocale = async (ctx: Context): Promise<string> => {
  // first check for actual cookie
  const cookieLanguage = getCookie(LANG_COOKIE_KEY, ctx);

  if (cookieLanguage === 'browser') {
    // then check for browser language
    return getBrowserLanguage(ctx);
  }

  // if we have the actual cookie with a valid language
  if (cookieLanguage && typeof cookieLanguage === 'string' && SUPPORTED_LANGS.includes(cookieLanguage)) {
    return cookieLanguage;
  }

  // Only check auth after cookie fails
  const user = await getUserFromContext(ctx);

  const isAuthenticated = user && user.role === 'authenticated';

  if (!isAuthenticated) {
    return DEFAULT_LANG;
  }

  // this means we haven't set the cookie
  // so now we fetch settings and check there.
  const settings = await prisma.settings.findUnique({ where: { userId: user.id } });

  // and if it's there, store in cookie and use it
  if (settings?.language) {
    setCookie(LANG_COOKIE_KEY, settings?.language, { ...ctx, sameSite: 'lax' });

    return settings?.language;
  }

  // if we also have nothing in the DB, just use the browser language
  // set the language selection to browser from now on
  // this prevents us from having to make a DB query each time
  setCookie(LANG_COOKIE_KEY, 'browser', { ...ctx, sameSite: 'lax' });

  return getBrowserLanguage(ctx);
};
