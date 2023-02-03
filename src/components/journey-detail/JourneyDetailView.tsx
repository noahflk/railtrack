import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import { trpc } from '@/utils/trpc';
import { StatsDisplay } from '@/components/StatsDisplay';
import { Link } from '@/components/Link';

export const JourneyDetailView: React.FC = () => {
  const router = useRouter();

  const t = useTranslations('dashboard');

  const { journey: journeyId } = router.query;

  const { data: journey } = trpc.journey.getOne.useQuery(Number(journeyId) ?? 0);
  const { data: stats } = trpc.journey.singleJourneyStats.useQuery(Number(journeyId) ?? 0);

  return (
    <div>
      <Link href="/journeys">{t('seeAll')}</Link>
      <h2 className="mb-6 mt-2 text-xl font-medium text-gray-900">
        {journey ? `${journey.departureStation} - ${journey.arrivalStation}` : '...'}
      </h2>
      <StatsDisplay type="journeyDetail" stats={stats} />
    </div>
  );
};
