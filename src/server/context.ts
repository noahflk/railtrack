import { type inferAsyncReturnType } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';

import { prisma } from '@/server/db/client';
import { getUserFromContext } from '@/utils/serverUser';

export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // @ts-expect-error context types do not quite match up
  const user = await getUserFromContext({ req, res });

  return {
    req,
    res,
    prisma,
    user,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
