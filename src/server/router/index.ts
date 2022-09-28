import superjson from 'superjson';

import { createRouter } from '@/server/router/context';
import { journeyRouter } from '@/server/router/journey';
import { settingsRouter } from '@/server/router/settings';
import { logRouter } from '@/server/router/log';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('journey.', journeyRouter)
  .merge('settings.', settingsRouter)
  .merge('log.', logRouter);

export type AppRouter = typeof appRouter;
