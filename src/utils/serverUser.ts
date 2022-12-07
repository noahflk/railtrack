import { createServerSupabaseClient, type User } from '@supabase/auth-helpers-nextjs';

import type { Context } from '@/types/context';

export const getUserFromContext = async (ctx: Context): Promise<User | null> => {
  const supabaseServerClient = createServerSupabaseClient(ctx);

  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();

  return user;
};
