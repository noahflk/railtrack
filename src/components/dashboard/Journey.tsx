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
      <p>
        <span>
          {info.departureStation} <ArrowNarrowRightIcon className="inline w-6 text-primary" /> {info.arrivalStation}
        </span>
        <span> - </span>
        <span>{info.distance} km</span>
      </p>
    </li>
  );
};

export default Journey;
