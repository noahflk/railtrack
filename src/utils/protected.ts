import type { GetServerSidePropsContext } from 'next';

import { getUserFromContext } from '@/utils/serverUser';
import { getLocaleProps } from '@/utils//locales';

const protectedAuth = async (ctx: GetServerSidePropsContext) => {
  const user = await getUserFromContext(ctx);

  const isAuthenticated = user && user.role === 'authenticated';

  if (isAuthenticated) {
    return { props: {}, redirect: { destination: '/dashboard' } };
  }

  return { props: {} };
};

export const protectedAuthWithLocales = async (ctx: GetServerSidePropsContext) => {
  const authCheck = await protectedAuth(ctx);

  // immediately perform redirect if authenticated
  if (authCheck.redirect) {
    return authCheck;
  }

  return getLocaleProps(ctx);
};
