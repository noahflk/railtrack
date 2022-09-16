import { InferQueryOutput } from '@/server/trpc-helper';
import { ArrowNarrowRightIcon } from '@heroicons/react/outline';

type Props = {
  // the [number] ensures we only get the item type without the array
  journey: InferQueryOutput<'journey.get'>[number];
};

export const Journey: React.FC<Props> = ({ journey }) => (
  <li className="flex items-center justify-between py-1">
    <p>
      <span>{journey.departureStation}</span> <ArrowNarrowRightIcon className="inline w-6 text-primary" />{' '}
      <span>{journey.arrivalStation}</span>
    </p>
  </li>
);
