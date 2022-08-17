import { GetServerSidePropsContext, NextApiRequest } from 'next';

import { getUser } from '@supabase/auth-helpers-nextjs';

export const protectedRoute = async (ctx: GetServerSidePropsContext) => {
  const { user } = await getUser(ctx);

  const isAuthenticated = user && user.role === 'authenticated';

  if (!isAuthenticated) {
    return { props: {}, redirect: { destination: '/signin' } };
  }

  return { props: {} };
};

export const protectedAuth = async (ctx: GetServerSidePropsContext) => {
  const { user } = await getUser(ctx);

  const isAuthenticated = user && user.role === 'authenticated';

  if (isAuthenticated) {
    return { props: {}, redirect: { destination: '/dashboard' } };
  }

  return { props: {} };
};
