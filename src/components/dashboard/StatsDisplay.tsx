import { GlobeIcon, ChartBarIcon, ClockIcon } from '@heroicons/react/outline';

import useStats from '@/hooks/useStats';
import Stat from '@/components/dashboard/Stat';

// TODO: could use some reafactoring along with Stat.tsx to minimize repetitions

const StatsDisplay: React.FC = () => {
  const { data } = useStats();

  if (!data) return <p>Loading</p>;

  const { distance, duration, count } = data;

  return (
    <ul role="list" className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Stat title="Distance travelled" icon={<GlobeIcon className="flex-shrink-0 w-14 h-14 sm:hidden xl:inline" />}>
        <p className="mt-2 text-3xl font-medium truncate">
          {distance} <span className="text-xl text-gray-500">km</span>
        </p>
      </Stat>
      <Stat title="Time spent travelling" icon={<ClockIcon className="flex-shrink-0 w-14 h-14 sm:hidden xl:inline" />}>
        <p className="mt-2 text-3xl font-medium truncate">
          {duration} <span className="text-xl text-gray-500">hours</span>
        </p>
      </Stat>
      <Stat title="Total trips" icon={<ChartBarIcon className="flex-shrink-0 w-14 h-14 sm:hidden xl:inline" />}>
        <p className="mt-2 text-3xl font-medium truncate">{count}</p>
      </Stat>
    </ul>
  );
};

export default StatsDisplay;
