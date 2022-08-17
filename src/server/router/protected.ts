import * as trpc from '@trpc/server';

import { createRouter } from '@/server/router/context';

export function createProtectedRouter() {
  return createRouter().middleware(({ ctx, next }) => {
    if (!ctx.user || ctx.user.role !== 'authenticated') {
      throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
      ctx: {
        ...ctx,
        // infers that `user` is non-nullable to downstream resolvers
        user: ctx.user,
      },
    });
  });
}
