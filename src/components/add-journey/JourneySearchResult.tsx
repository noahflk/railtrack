import { format } from 'date-fns';

import type { Connection } from '@/types/opendata';
import { parseDurationString } from '@/utils/duration';
import { trpc } from '@/utils/trpc';

type Props = {
  connection: Connection;
};

export const JourneySearchResult: React.FC<Props> = ({ connection }) => {
  const mutation = trpc.useMutation('connection.add');

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
          {connection.transfers} {connection.transfers === 1 ? 'change' : 'changes'},{' '}
          {parseDurationString(connection.duration)} mins
        </span>
        <button
          onClick={() =>
            mutation.mutate(
              {
                departureStation: connection.from.station.name,
                arrivalStation: connection.to.station.name,
                departureTime: connection.from.departure,
                platform: connection.from.platform,
              },
              {
                onSuccess: () => {
                  console.log('NICE ONE');
                },
              }
            )
          }
          className="font-medium text-small text-primary hover:text-primary-light"
        >
          Add
        </button>
      </p>
    </li>
  );
};
