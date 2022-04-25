import { ArrowNarrowRightIcon } from '@heroicons/react/outline';

import type { Journey as JourneyType } from '@/types/journey';

type Props = {
  journey: JourneyType;
};

const Journey: React.FC<Props> = ({ journey }) => (
  <li className="flex items-center justify-between py-1">
    <div className="flex justify-between w-full">
      <p>
        {journey.departureStation} <ArrowNarrowRightIcon className="inline w-6 text-primary" /> {journey.arrivalStation}
      </p>
      <p>{journey.distance} km</p>
    </div>
  </li>
);

export default Journey;
