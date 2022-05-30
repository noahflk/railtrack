import useRecentJourneys from '@/hooks/useRecentJourneys';
import Journey from '@/components/dashboard/Journey';
import EmptyJourneyNotice from '@/components/EmptyJourneyNotice';
import Link from '@/components/Link';
import { sortJourneysLatestFirst } from '@/utils/sorters';

const RecentJourneys: React.FC = () => {
  const { data: journeys } = useRecentJourneys();

  if (!journeys) return <p>Loading...</p>;

  const sortedJourneys = sortJourneysLatestFirst(journeys);

  return (
    <div className="col-span-1 p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-medium text-gray-900">Recent journeys</h3>
      {sortedJourneys.length > 0 ? (
        <div className="flex flex-col justify-between h-full pb-5">
          <ul>
            {sortedJourneys.map((journey) => (
              <Journey key={journey.id} journey={journey} />
            ))}
          </ul>
          <div>
            <Link href="/journeys">See all journeys</Link>
          </div>
        </div>
      ) : (
        <EmptyJourneyNotice />
      )}
    </div>
  );
};

export default RecentJourneys;
