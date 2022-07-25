import { createRouter } from './context';
import superjson from 'superjson';

import { connectionRouter } from '@/server/router/connection';

export const appRouter = createRouter().transformer(superjson).merge('connection.', connectionRouter);

export type AppRouter = typeof appRouter;
