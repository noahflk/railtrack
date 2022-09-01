import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import router from 'next/router';
import toast from 'react-hot-toast';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { RodIcon } from '@/components/Icons';
import { useJourneySearchStore } from '@/hooks/useJourneySearchStore';
import type { Connection } from '@/types/opendata';
import { parseDurationString } from '@/utils/duration';
import { trpc } from '@/utils/trpc';

type Props = {
  connection: Connection;
};

const AddButton: React.FC<Props> = ({ connection }) => {
  const mutation = trpc.useMutation('connection.add');
  const utils = trpc.useContext();

  const clearSearchInfo = useJourneySearchStore((state) => state.clearSearchInfo);

  const t = useTranslations('add');

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

              utils.invalidateQueries(['connection.get']);
              utils.invalidateQueries(['connection.stats']);
            },
            onError: () => {
              toast.error('Unable to add new connection');
            },
          }
        )
      }
      className="font-medium text-small text-primary hover:text-primary-light"
    >
      {t('save')}
    </button>
  );
};

export const JourneySearchResult: React.FC<Props> = ({ connection }) => {
  const t = useTranslations('add');

  return (
    <li className="py-2 pt-4 space-y-2">
      <p>
        <span className="inline-flex items-center px-2.5 mr-2 py-1 rounded-full text-sm font-medium bg-primary text-white">
          {connection.products[0]}
        </span>
        Direction {connection.sections[0]?.journey.to}
      </p>
      <div className="flex justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <span>{format(new Date(connection.from.departureTimestamp * 1000), 'HH:mm')}</span>
          <RodIcon />
          <span>{format(new Date(connection.to.arrivalTimestamp * 1000), 'HH:mm')}</span>
        </div>
        <p>
          {connection.transfers} {connection.transfers === 1 ? t('stop_one') : t('stop_other')}
        </p>
        <p>{parseDurationString(connection.duration)} min</p>
        <AddButton connection={connection} />
      </div>
    </li>
  );
};
