import { router } from '@/server/trpc';
import { infiniteJourneys, journeyRouter } from '@/server/router/journey';
import { settingsRouter } from '@/server/router/settings';

export const appRouter = router({
  infiniteJourneys: infiniteJourneys,
  journey: journeyRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
