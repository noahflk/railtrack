import router from 'next/router';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

import type { Connection } from '@/types/opendata';
import { parseDurationString } from '@/utils/duration';
import { useJourneySearchStore } from '@/hooks/useJourneySearchStore';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { trpc } from '@/utils/trpc';

type Props = {
  connection: Connection;
};

const AddButton: React.FC<Props> = ({ connection }) => {
  const mutation = trpc.useMutation('connection.add');

  const clearSearchInfo = useJourneySearchStore((state) => state.clearSearchInfo);

  if (mutation.isLoading) return <LoadingSpinner color="primary" />;

  return (
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
              // Redirect away after creating new journey
              router.push('/dashboard');
              clearSearchInfo();

              // TODO: invalidate these queries once they exist
              // queryClient.invalidateQueries('journey-stats');
              // queryClient.invalidateQueries('recent-journeys');
            },
            onError: () => {
              toast.error('Unable to add new connection');
            },
          }
        )
      }
      className="font-medium text-small text-primary hover:text-primary-light"
    >
      Add
    </button>
  );
};

export const JourneySearchResult: React.FC<Props> = ({ connection }) => {
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
        <AddButton connection={connection} />
      </p>
    </li>
  );
};
