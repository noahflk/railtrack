import { ArrowNarrowRightIcon } from '@heroicons/react/outline';
import { formatInTimeZone } from 'date-fns-tz';

import { RouterOutputs } from '@/utils/trpc';

type Props = {
  // the [number] ensures we only get the item type without the array
  journey: RouterOutputs['journey']['get'][number];
};

export const Journey: React.FC<Props> = ({ journey }) => (
  <li className="flex items-center justify-between py-1">
    <p>
      <span className="font-medium">{formatInTimeZone(journey.departureTime, 'Europe/Zurich', 'dd.MM')} - </span>
      <span>{journey.departureStation}</span> <ArrowNarrowRightIcon className="inline w-6 text-primary" />{' '}
      <span>{journey.arrivalStation}</span>
    </p>
  </li>
);
