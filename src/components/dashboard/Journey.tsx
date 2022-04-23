import { ArrowNarrowRightIcon } from '@heroicons/react/outline';

import { definitions } from '@/types/supabase';
import useJourneyStats from '@/hooks/useJourneyStats';

type Props = {
  journey: definitions['journeys'];
};

const Journey: React.FC<Props> = ({ journey }) => {
  const { data: info } = useJourneyStats(journey.id);

  if (!info) return <li>Loading...</li>;

  return (
    <li className="flex items-center justify-between py-1">
      <div className="flex justify-between w-full">
        <p>
          {info.departureStation} <ArrowNarrowRightIcon className="inline w-6 text-primary" /> {info.arrivalStation}
        </p>
        <p>{info.distance} km</p>
      </div>
    </li>
  );
};

export default Journey;
