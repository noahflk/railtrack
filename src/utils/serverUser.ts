import type { GetServerSidePropsContext } from 'next';
import { createServerSupabaseClient, type User } from '@supabase/auth-helpers-nextjs';

export const getUserFromContext = async (ctx: GetServerSidePropsContext): Promise<User | null> => {
  const supabaseServerClient = createServerSupabaseClient(ctx);

  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();

  return user;
};
