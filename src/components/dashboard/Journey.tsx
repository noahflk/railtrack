import { ArrowNarrowRightIcon } from '@heroicons/react/outline';
import { formatInTimeZone } from 'date-fns-tz';

import type { RouterOutputs } from '@/utils/trpc';
import { APP_TIMEZONE } from '@/constants';

type Props = {
  // the [number] ensures we only get the item type without the array
  journey: RouterOutputs['journey']['get'][number];
};

export const Journey: React.FC<Props> = ({ journey }) => (
  <li className="flex items-center justify-between py-1">
    <p>
      <span className="font-medium">{formatInTimeZone(journey.departureTime, APP_TIMEZONE, 'dd.MM')} - </span>
      <span>{journey.departureStation}</span> <ArrowNarrowRightIcon className="inline w-6 text-primary" />{' '}
      <span>{journey.arrivalStation}</span>
    </p>
  </li>
);
