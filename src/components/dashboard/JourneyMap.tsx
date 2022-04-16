import Map from '@/components/Map';
import useStats from '@/hooks/useStats';

const JourneyMap: React.FC = () => {
  const { data } = useStats();

  // render empty map
  if (!data) return <Map journeys={[]} />;

  const { coordinates } = data;

  return (
    <div className="col-span-1 bg-white divide-y divide-gray-200 rounded-lg shadow lg:col-span-2">
      <Map journeys={coordinates} />
    </div>
  );
};

export default JourneyMap;
