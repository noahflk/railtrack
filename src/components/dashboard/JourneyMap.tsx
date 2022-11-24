import { Map } from '@/components/Map';
import { trpc } from '@/utils/trpc';

export const JourneyMap: React.FC = () => {
  const { data: stats } = trpc.journey.stats.useQuery();

  return (
    <div className="col-span-1 bg-white divide-y divide-gray-200 rounded-lg shadow lg:col-span-2">
      <Map journeys={stats?.coordinates ?? []} />
    </div>
  );
};
