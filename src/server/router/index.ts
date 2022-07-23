import { createRouter } from './context';
import superjson from 'superjson';

import { exampleRouter } from '@/server/router/example';
import { journeyRouter } from '@/server/router/journey';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('example.', exampleRouter)
  .merge('journey.', journeyRouter);

export type AppRouter = typeof appRouter;
