import { GetServerSidePropsContext } from 'next';
// src/server/router/context.ts
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getUser } from '@supabase/auth-helpers-nextjs';

import { prisma } from '@/server/db/client';

type SupabaseUser = {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmation_sent_at: string;
  confirmed_at: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
};

export const createContext = async (opts?: trpcNext.CreateNextContextOptions) => {
  const req = opts?.req;
  const res = opts?.res;

  const user = opts ? (await getUser(opts)).user : null;

  return {
    req,
    res,
    prisma,
    user: user as SupabaseUser,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
