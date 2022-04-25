import { format } from 'date-fns';

import useStoreNewJourney from '@/hooks/useStoreNewJourney';
import { parseDurationString } from '@/utils/duration';
import type { Connection } from '@/types/opendata';

type Props = {
  connection: Connection;
};

const JourneySearchResult: React.FC<Props> = ({ connection }) => {
  const mutation = useStoreNewJourney();

  return (
    <li className="py-2">
      <p className="flex justify-between space-x-2">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-primary text-white">
          {connection.products[0]}
        </span>
        <div className="flex items-center space-x-2">
          <span>{format(new Date(connection.from.departureTimestamp * 1000), 'HH:mm')}</span>
          <img src="/images/rod.svg" alt="rod" className="text-white" />
          <span>{format(new Date(connection.to.arrivalTimestamp * 1000), 'HH:mm')}</span>
        </div>
        <span>
          {connection.transfers} {connection.transfers === 1 ? 'change' : 'changes'}, {parseDurationString(connection.duration)} mins
        </span>
        <button onClick={() => mutation.mutate(connection)} className="font-medium text-small text-primary hover:text-primary-light">
          Add
        </button>
      </p>
    </li>
  );
};

export default JourneySearchResult;
