import { IncomingMessage } from 'http';

import { supabase } from '@/utils/supabase';

const getCurrentUser = async (req: IncomingMessage) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  return user;
};

export const protectedRoute = async (req: IncomingMessage) => {
  const isSignedIn = await getCurrentUser(req);

  if (!isSignedIn) {
    return { props: {}, redirect: { destination: '/signin' } };
  }

  return { props: {} };
};

export const protectedAuth = async (req: IncomingMessage) => {
  const isSignedIn = await getCurrentUser(req);

  if (isSignedIn) {
    return { props: {}, redirect: { destination: '/dashboard' } };
  }

  return { props: {} };
};
