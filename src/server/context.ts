import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';

import { prisma } from '@/server/db/client';
import { getUserFromContext } from '@/utils/serverUser';

export const createContext = async (opts: CreateNextContextOptions) => {
  const user = await getUserFromContext(opts);

  const { req, res } = opts;

  return {
    req,
    res,
    prisma,
    user,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
