import { useTranslations } from 'next-intl';
import router from 'next/router';
import { useBreakpoint } from 'react-breakout';
import toast from 'react-hot-toast';

import { JourneyStopIndicator } from '@/components/add-journey/JourneyStopIndicator';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useJourneySearchStore } from '@/hooks/useJourneySearchStore';
import type { Journey } from '@/types/opendata';
import { parseDurationString } from '@/utils/duration';
import { trpc } from '@/utils/trpc';

type Props = {
  journey: Journey;
};

const AddButton: React.FC<Props> = ({ journey }) => {
  const mutation = trpc.journey.add.useMutation();
  const utils = trpc.useContext();

  const clearSearchInfo = useJourneySearchStore((state) => state.clearSearchInfo);

  const t = useTranslations('add');

  if (mutation.isLoading) return <LoadingSpinner color="primary" />;

  return (
    <button
      onClick={() =>
        mutation.mutate(
          {
            departureStation: journey.from.station.name,
            arrivalStation: journey.to.station.name,
            departureTime: journey.from.departure,
            platform: journey.from.platform,
          },
          {
            onSuccess: () => {
              toast.success(t('journeyAdded'));

              // Redirect away after creating new journey
              router.push('/dashboard');
              clearSearchInfo();

              utils.journey.get.invalidate();
              utils.journey.stats.invalidate();
            },
            onError: () => {
              toast.error(t('journeyAddFailed'));
            },
          }
        )
      }
      className="text-small inline-flex justify-center font-medium text-primary hover:text-primary-light"
    >
      {/* invisible means text remains hidden in the background to preserve the button width */}
      <span className={mutation.isLoading ? 'invisible' : undefined}>{t('save')}</span>
      {mutation.isLoading && <LoadingSpinner className="absolute" />}
    </button>
  );
};

const DesktopSearchResult: React.FC<Props> = ({ journey }) => {
  const t = useTranslations('add');

  return (
    <li className="space-y-2 py-2 pt-4">
      <p>
        <span className="mr-2 inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-sm font-medium text-white">
          {journey.products[0]}
        </span>
        Direction {journey.sections[0]?.journey?.to}
      </p>
      <div className="flex justify-between space-x-2">
        <JourneyStopIndicator className="w-96" journey={journey} />
        <p>
          {journey.transfers} {journey.transfers === 1 ? t('stop_one') : t('stop_other')}
        </p>
        <p>{parseDurationString(journey.duration)} min</p>
        <AddButton journey={journey} />
      </div>
    </li>
  );
};

const MobileSearchResult: React.FC<Props> = ({ journey }) => {
  const t = useTranslations('add');

  return (
    <li className="space-y-2 py-2 pt-4">
      <p>
        <span className="mr-2 inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-sm font-medium text-white">
          {journey.products[0]}
        </span>
        Direction {journey.sections[0]?.journey?.to}
      </p>
      <JourneyStopIndicator className="w-full" journey={journey} />
      <div className="flex justify-between">
        <p>
          {journey.transfers} {journey.transfers === 1 ? t('stop_one') : t('stop_other')},{' '}
          {parseDurationString(journey.duration)} min
        </p>
        <AddButton journey={journey} />
      </div>
    </li>
  );
};

export const JourneySearchResult: React.FC<Props> = ({ journey }) => {
  const isDesktop = useBreakpoint('md');

  if (isDesktop) return <DesktopSearchResult journey={journey} />;

  return <MobileSearchResult journey={journey} />;
};
