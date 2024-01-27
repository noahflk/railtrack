import { createPagesServerClient, type User } from '@supabase/auth-helpers-nextjs';

import type { Context } from '@/types/context';

export const getUserFromContext = async (ctx: Context): Promise<User | null> => {
  // Here we create a new instance of the Supabase client suitable for server-side operations in a Next.js environment
  const supabaseServerClient = createPagesServerClient(ctx);

  // Fetch the user using the Supabase client
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();

  // Return the user object if it exists
  return user;
};
