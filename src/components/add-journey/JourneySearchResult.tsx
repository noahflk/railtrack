import { useTranslations } from 'next-intl';
import router from 'next/router';
import { useBreakpoint } from 'react-breakout';
import toast from 'react-hot-toast';

import { JourneyStopIndicator } from '@/components/add-journey/JourneyStopIndicator';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useJourneySearchStore } from '@/hooks/useJourneySearchStore';
import type { Connection } from '@/types/opendata';
import { parseDurationString } from '@/utils/duration';
import { trpc } from '@/utils/trpc';

type Props = {
  connection: Connection;
};

const AddButton: React.FC<Props> = ({ connection }) => {
  const mutation = trpc.useMutation('journey.add');
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

              utils.invalidateQueries(['journey.get']);
              utils.invalidateQueries(['journey.stats']);
            },
            onError: () => {
              toast.error('Unable to add new connection');
            },
          }
        )
      }
      className="inline-flex justify-center font-medium text-small text-primary hover:text-primary-light"
    >
      {/* invisible means text remains hidden in the background to preserve the button width */}
      <span className={mutation.isLoading ? 'invisible' : undefined}>{t('save')}</span>
      {mutation.isLoading && <LoadingSpinner className="absolute" />}
    </button>
  );
};

const DesktopSearchResult: React.FC<Props> = ({ connection }) => {
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
        <JourneyStopIndicator className="w-96" connection={connection} />
        <p>
          {connection.transfers} {connection.transfers === 1 ? t('stop_one') : t('stop_other')}
        </p>
        <p>{parseDurationString(connection.duration)} min</p>
        <AddButton connection={connection} />
      </div>
    </li>
  );
};

const MobileSearchResult: React.FC<Props> = ({ connection }) => {
  const t = useTranslations('add');

  return (
    <li className="py-2 pt-4 space-y-2">
      <p>
        <span className="inline-flex items-center px-2.5 mr-2 py-1 rounded-full text-sm font-medium bg-primary text-white">
          {connection.products[0]}
        </span>
        Direction {connection.sections[0]?.journey.to}
      </p>
      <JourneyStopIndicator className="w-full" connection={connection} />
      <div className="flex justify-between">
        <p>
          {connection.transfers} {connection.transfers === 1 ? t('stop_one') : t('stop_other')},{' '}
          {parseDurationString(connection.duration)} min
        </p>
        <AddButton connection={connection} />
      </div>
    </li>
  );
};

export const JourneySearchResult: React.FC<Props> = ({ connection }) => {
  const isDesktop = useBreakpoint('md');

  if (isDesktop) return <DesktopSearchResult connection={connection} />;

  return <MobileSearchResult connection={connection} />;
};
