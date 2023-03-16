import { router } from '@/server/trpc';
import { journeyRouter } from '@/server/router/journey';
import { settingsRouter } from '@/server/router/settings';
import { statsRouter } from '@/server/router/stats';
import { chartsRouter } from '@/server/router/charts';

export const appRouter = router({
  journey: journeyRouter,
  settings: settingsRouter,
  stats: statsRouter,
  charts: chartsRouter,
});

export type AppRouter = typeof appRouter;
