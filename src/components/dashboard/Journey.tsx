import { ArrowNarrowRightIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';

import { InferQueryOutput } from '@/server/trpc-helper';

type Props = {
  // the [number] ensures we only get the item type without the array
  journey: InferQueryOutput<'journey.get'>[number];
};

export const Journey: React.FC<Props> = ({ journey }) => (
  <li className="flex items-center justify-between py-1">
    <p>
      <span className="font-medium">{format(journey.departureTime, 'dd.MM')} - </span>
      <span>{journey.departureStation}</span> <ArrowNarrowRightIcon className="inline w-6 text-primary" />{' '}
      <span>{journey.arrivalStation}</span>
    </p>
  </li>
);
