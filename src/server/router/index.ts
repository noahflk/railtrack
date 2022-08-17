import superjson from 'superjson';

import { createRouter } from '@/server/router/context';
import { connectionRouter } from '@/server/router/connection';
import { settingsRouter } from '@/server/router/settings';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('connection.', connectionRouter)
  .merge('settings.', settingsRouter);

export type AppRouter = typeof appRouter;
