import useRecentJourneys from '@/hooks/useRecentJourneys';
import Journey from '@/components/dashboard/Journey';
import EmptyJourneyNotice from '@/components/EmptyJourneyNotice';
import Link from '@/components/Link';

const RecentJourneys: React.FC = () => {
  const { data: journeys } = useRecentJourneys();

  if (!journeys) return <p>Loading...</p>;

  return (
    <div className="col-span-1 p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-medium text-gray-900">Recent journeys</h3>
      {journeys.length > 0 ? (
        <div className="flex flex-col justify-between h-full pb-5">
          <ul>
            {journeys.map((journey) => (
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
