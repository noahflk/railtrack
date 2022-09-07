import type { GetServerSidePropsContext } from 'next';

import { getLocaleProps } from '@/utils/locales';
import { protectedAuth, protectedRoute } from '@/utils/protected';

export const protectedRouteWithLocales = async (ctx: GetServerSidePropsContext) => {
  const authCheck = await protectedRoute(ctx);

  // immediately perform redirect if not authenticated
  if (authCheck.redirect) {
    return authCheck;
  }

  return getLocaleProps(ctx);
};

export const protectedAuthWithLocales = async (ctx: GetServerSidePropsContext) => {
  const authCheck = await protectedAuth(ctx);

  // immediately perform redirect if authenticated
  if (authCheck.redirect) {
    return authCheck;
  }

  return getLocaleProps(ctx);
};
