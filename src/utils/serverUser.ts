import { createServerSupabaseClient, type User } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

type Ctx = {
  res: NextApiResponse;
  req: NextApiRequest;
};

export const getUserFromContext = async (ctx: Ctx): Promise<User | null> => {
  const supabaseServerClient = createServerSupabaseClient(ctx);

  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();

  return user;
};
