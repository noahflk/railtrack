import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

import { prisma } from '@/server/db/client';
import { getUserFromContext } from '@/utils/serverUser';

export const createContext = async (opts: trpcNext.CreateNextContextOptions) => {
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

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
