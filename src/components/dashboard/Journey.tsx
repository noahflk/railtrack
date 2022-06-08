import { ArrowNarrowRightIcon } from '@heroicons/react/outline';

import type { Journey as JourneyType } from '@/types/journey';

type Props = {
  journey: JourneyType;
};

const Journey: React.FC<Props> = ({ journey }) => (
  <li className="flex items-center justify-between py-1">
    <p>
      <span>{journey.departureStation}</span> <ArrowNarrowRightIcon className="inline w-6 text-primary" />{' '}
      <span>{journey.arrivalStation}</span>
    </p>
  </li>
);

export default Journey;
