import { useTranslations } from 'next-intl';

import { Journey } from '@/components/dashboard/Journey';
import { EmptyJourneyNotice } from '@/components/EmptyJourneyNotice';
import { Link } from '@/components/Link';
import { trpc } from '@/utils/trpc';

const RecentJourneysWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = useTranslations('dashboard');

  return (
    <div className="col-span-1 rounded-lg bg-white p-4 shadow">
      <h3 className="text-xl font-medium text-gray-900">{t('recent')}</h3>
      {children}
    </div>
  );
};

const FETCH_JOURNEY_LIMIT = 7;

export const RecentJourneys: React.FC = () => {
  const { data: journeys } = trpc.journey.get.useQuery(FETCH_JOURNEY_LIMIT);

  const t = useTranslations('dashboard');

  if (!journeys)
    return (
      <RecentJourneysWrapper>
        <div className="w-full animate-pulse space-y-4 pt-4 ">
          <div className="h-6 rounded-md bg-gray-300 "></div>
          <div className="h-6 rounded-md bg-gray-300 "></div>
          <div className="h-6 rounded-md bg-gray-300 "></div>
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
      <div className="flex h-full flex-col justify-between pb-5">
        <ul>
          {sortedJourneys.map((journey) => (
            <a key={journey.id} href={`/journeys/${journey.uuid}`}>
              <Journey journey={journey} />
            </a>
          ))}
        </ul>
        <div className="p-1">
          <Link href="/journeys">{t('seeAll')}</Link>
        </div>
      </div>
    </RecentJourneysWrapper>
  );
};
