import type { GetServerSidePropsContext } from 'next';

import { protectedRoute } from '@/utils/protected';
import { getLocale } from '@/utils/getLocale';

export const protectedRouteWithLocales = async (ctx: GetServerSidePropsContext) => {
  const authCheck = await protectedRoute(ctx);

  // immediately perform redirect if not authenticated
  if (authCheck.redirect) {
    return authCheck;
  }

  const locale = await getLocale(ctx);

  return {
    props: { messages: (await import(`../locales/${locale}.json`)).default },
  };
};
