import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

import { type Context } from '@/server/context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

//  Unprotected procedure
export const publicProcedure = t.procedure;

// Reusable middleware to ensure users are logged in
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== 'authenticated') {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      // infers that `user` is non-nullable to downstream resolvers
      user: ctx.user,
    },
  });
});

// Protected procedure
export const protectedProcedure = t.procedure.use(isAuthed);
