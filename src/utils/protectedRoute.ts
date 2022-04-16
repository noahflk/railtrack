import { supabase } from '@/utils/supabaseClient';

const getCurrentUser = async (req) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  return user;
};

export const protectedRoute = async (req) => {
  const isSignedIn = await getCurrentUser(req);

  if (!isSignedIn) {
    return { props: {}, redirect: { destination: '/signin' } };
  }

  return { props: {} };
};

export const protectedAuth = async (req) => {
  const isSignedIn = await getCurrentUser(req);

  if (isSignedIn) {
    return { props: {}, redirect: { destination: '/dashboard' } };
  }

  return { props: {} };
};
