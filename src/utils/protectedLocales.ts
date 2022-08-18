import type { GetServerSidePropsContext } from 'next';

import { protectedRoute, protectedAuth } from '@/utils/protected';
import { getCookieLocale, getLocale } from '@/utils/getLocale';

export const protectedRouteWithLocales = async (ctx: GetServerSidePropsContext) => {
  const authCheck = await protectedRoute(ctx);

  // immediately perform redirect if not authenticated
  if (authCheck.redirect) {
    return authCheck;
  }

  const locale = await getLocale(ctx);

  return {
    props: { messages: (await import(`../locales/${locale}.json`)).default, locale },
  };
};

export const protectedAuthWithLocales = async (ctx: GetServerSidePropsContext) => {
  const authCheck = await protectedAuth(ctx);

  // immediately perform redirect if authenticated
  if (authCheck.redirect) {
    return authCheck;
  }

  const locale = await getCookieLocale(ctx);

  return {
    props: { messages: (await import(`../locales/${locale}.json`)).default, locale },
  };
};
