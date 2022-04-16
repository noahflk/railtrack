import useRecentJourneys from '@/hooks/useRecentJourneys';
import Journey from '@/components/dashboard/Journey';

const RecentJourneys: React.FC = () => {
  const { data: journeys } = useRecentJourneys();

  if (!journeys) return <p>Loading...</p>;

  return (
    <div className="col-span-1 p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-medium text-gray-900">Recent trips</h3>
      <ul>
        {journeys.map((journey) => (
          <Journey key={journey.id} journey={journey} />
        ))}
      </ul>
    </div>
  );
};

export default RecentJourneys;
