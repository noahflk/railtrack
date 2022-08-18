import { GetServerSidePropsContext } from 'next';
import { getUser } from '@supabase/auth-helpers-nextjs';
import { getCookie, setCookie } from 'cookies-next';

import { prisma } from '@/server/db/client';
import parser from 'accept-language-parser';

const SUPPORTED_LANGS = ['en', 'de'];
const DEFAULT_LANG = 'en';

export const getCookieLocale = (ctx: GetServerSidePropsContext): string => {
  // first check for actual cookie
  const cookieLanguage = getCookie('i18n-lang', ctx);

  // if we have the actual cookie with a valid language
  if (cookieLanguage && typeof cookieLanguage === 'string' && SUPPORTED_LANGS.includes(cookieLanguage)) {
    return cookieLanguage;
  }

  // otherwise return default language
  return DEFAULT_LANG;
};

export const getLocale = async (ctx: GetServerSidePropsContext): Promise<string> => {
  // first check for actual cookie
  const cookieLanguage = getCookie('i18n-lang', ctx);

  // if we have the actual cookie with a valid language
  if (cookieLanguage && typeof cookieLanguage === 'string' && SUPPORTED_LANGS.includes(cookieLanguage)) {
    return cookieLanguage;
  }

  // Only check auth after cookie fails
  const { user } = await getUser(ctx);

  const isAuthenticated = user && user.role === 'authenticated';

  if (!isAuthenticated) {
    return DEFAULT_LANG;
  }

  // this means we haven't set the cookie
  // so now we fetch settings and check there.
  const settings = await prisma.settings.findUnique({ where: { userId: user.id } });

  // and if it's there store in cookie and use it
  if (settings?.language) {
    setCookie('i18n-lang', settings?.language, ctx);

    return settings?.language;
  }

  // if we also have no lib, just use the browser language
  // we also store it in a cookie. This is not ideal if the user changes the language of the browser
  // but it can always be adjusted in settings
  // we do this because it would be inefficient to make the DB call on every page load

  const languages = ctx.req.headers['accept-language'];
  // use english as the default
  const language = parser.pick(SUPPORTED_LANGS, languages ?? '', { loose: true }) ?? DEFAULT_LANG;

  setCookie('i18n-lang', language, ctx);

  return language;
};
