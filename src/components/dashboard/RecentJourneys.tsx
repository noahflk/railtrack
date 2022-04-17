import { DocumentSearchIcon } from '@heroicons/react/outline';

import useRecentJourneys from '@/hooks/useRecentJourneys';
import Journey from '@/components/dashboard/Journey';
import Link from '@/components/Link';

const RecentJourneys: React.FC = () => {
  const { data: journeys } = useRecentJourneys();

  if (!journeys) return <p>Loading...</p>;

  return (
    <div className="col-span-1 p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-medium text-gray-900">Recent trips</h3>
      {journeys.length > 0 ? (
        <ul>
          {journeys.map((journey) => (
            <Journey key={journey.id} journey={journey} />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center h-full pb-8 space-y-2">
          <DocumentSearchIcon className="w-20 " />
          <p className="text-lg font-medium">No journeys yet!</p>
          <Link href="/add">Add new journey</Link>
        </div>
      )}
    </div>
  );
};

export default RecentJourneys;
