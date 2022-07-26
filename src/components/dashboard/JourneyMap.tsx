import { Map } from '@/components/Map';
import { trpc } from '@/utils/trpc';

export const JourneyMap: React.FC = () => {
  const { data: stats } = trpc.useQuery(['connection.stats']);

  // render map with no journeys while loading them
  if (!stats) return <Map journeys={[]} />;

  return (
    <div className="col-span-1 bg-white divide-y divide-gray-200 rounded-lg shadow lg:col-span-2">
      <Map journeys={stats.coordinates} />
    </div>
  );
};
