import { router } from '@/server/trpc';
import { journeyRouter } from '@/server/router/journey';
import { settingsRouter } from '@/server/router/settings';
import { statsRouter } from '@/server/router/stats';

export const appRouter = router({
  journey: journeyRouter,
  settings: settingsRouter,
  stats: statsRouter,
});

export type AppRouter = typeof appRouter;
