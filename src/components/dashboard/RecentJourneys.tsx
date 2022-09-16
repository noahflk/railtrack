import { useTranslations } from 'next-intl';

import { Journey } from '@/components/dashboard/Journey';
import { EmptyJourneyNotice } from '@/components/EmptyJourneyNotice';
import { Link } from '@/components/Link';
import { trpc } from '@/utils/trpc';

const RecentJourneysWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = useTranslations('dashboard');

  return (
    <div className="col-span-1 p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-medium text-gray-900">{t('recent')}</h3>
      {children}
    </div>
  );
};

const FETCH_JOURNEY_LIMIT = 7;

export const RecentJourneys: React.FC = () => {
  const { data: journeys } = trpc.useQuery(['journey.get', FETCH_JOURNEY_LIMIT]);

  const t = useTranslations('dashboard');

  if (!journeys)
    return (
      <RecentJourneysWrapper>
        <div className="w-full pt-4 space-y-4 animate-pulse ">
          <div className="h-6 bg-gray-300 rounded-md "></div>
          <div className="h-6 bg-gray-300 rounded-md "></div>
          <div className="h-6 bg-gray-300 rounded-md "></div>
        </div>
      </RecentJourneysWrapper>
    );

  const sortedJourneys = journeys.sort((a, b) => b.departureTime.getTime() - a.departureTime.getTime());

  if (sortedJourneys.length === 0)
    return (
      <RecentJourneysWrapper>
        <EmptyJourneyNotice />
      </RecentJourneysWrapper>
    );

  return (
    <RecentJourneysWrapper>
      <div className="flex flex-col justify-between h-full pb-5">
        <ul>
          {sortedJourneys.map((journey) => (
            <Journey key={journey.id} journey={journey} />
          ))}
        </ul>
        <div className="p-1">
          <Link href="/journeys">{t('seeAll')}</Link>
        </div>
      </div>
    </RecentJourneysWrapper>
  );
};
