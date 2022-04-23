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
        <ul>
          {journeys.map((journey) => (
            <Journey key={journey.id} journey={journey} />
          ))}
          <Link href="/journeys">See all journeys</Link>
        </ul>
      ) : (
        <EmptyJourneyNotice />
      )}
    </div>
  );
};

export default RecentJourneys;
