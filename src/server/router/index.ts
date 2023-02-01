import { router } from '@/server/trpc';
import { journeyRouter } from '@/server/router/journey';
import { settingsRouter } from '@/server/router/settings';

export const appRouter = router({
  journey: journeyRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
