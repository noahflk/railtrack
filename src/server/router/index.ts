import superjson from 'superjson';

import { createRouter } from '@/server/router/context';
import { journeyRouter } from '@/server/router/journey';
import { settingsRouter } from '@/server/router/settings';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('journey.', journeyRouter)
  .merge('settings.', settingsRouter);

export type AppRouter = typeof appRouter;
