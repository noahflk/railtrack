import { useRouter } from 'next/router';

import { trpc } from '@/utils/trpc';
import { StatsDisplay } from '@/components/StatsDisplay';

export const JourneyDetailView: React.FC = () => {
  const router = useRouter();

  const { journey: journeyId } = router.query;

  const { data: journey } = trpc.journey.getOne.useQuery(Number(journeyId) ?? 0);
  const { data: stats } = trpc.journey.singleJourneyStats.useQuery(Number(journeyId) ?? 0);

  return (
    <div>
      <h2 className="mb-6 text-xl font-medium text-gray-900">
        {journey ? `${journey.departureStation} - ${journey.arrivalStation}` : '...'}
      </h2>
      <StatsDisplay type="journeyDetail" stats={stats} />
    </div>
  );
};
