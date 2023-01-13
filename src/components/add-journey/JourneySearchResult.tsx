import { Disclosure } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import router from 'next/router';
import { Fragment } from 'react';
import { useBreakpoint } from 'react-breakout';
import toast from 'react-hot-toast';

import { JourneySectionsDetails } from '@/components/add-journey/JourneySectionsDetails';
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

  return (
    <button
      onClick={(e) => {
        // prevents toggle of detail view when saving
        e.stopPropagation();

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
        );
      }}
      className="text-small inline-flex justify-center font-medium text-primary hover:text-primary-light"
    >
      {/* invisible means text remains hidden in the background to preserve the button width */}
      <span className={mutation.isLoading ? 'invisible' : undefined}>{t('save')}</span>
      {mutation.isLoading && <LoadingSpinner className="absolute" />}
    </button>
  );
};

const JourneyHeader: React.FC<Props> = ({ journey }) => {
  const t = useTranslations('add');

  const firstValidSection = journey.sections.find((section) => section.journey);
  const firstNonEmptyProduct = journey.products.find((product) => product !== ' ');

  if (!firstValidSection) return null;

  return (
    <p>
      {firstNonEmptyProduct && (
        <span className="mr-2 inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-sm font-medium text-white">
          {firstNonEmptyProduct}
        </span>
      )}
      {t('direction')} {firstValidSection.journey?.to}
    </p>
  );
};

const DesktopSearchResult: React.FC<Props> = ({ journey }) => {
  const t = useTranslations('add');

  return (
    <Disclosure as="li">
      <Disclosure.Button as={Fragment}>
        <div className="cursor-pointer space-y-3 px-5 py-6 transition hover:bg-gray-100">
          <JourneyHeader journey={journey} />
          <div className="flex justify-between space-x-2">
            <JourneyStopIndicator className="w-96" journey={journey} />
            <p>
              {journey.transfers} {journey.transfers === 1 ? t('stop_one') : t('stop_other')}
            </p>
            <p>{parseDurationString(journey.duration)} min</p>
            <AddButton journey={journey} />
          </div>
        </div>
      </Disclosure.Button>
      <JourneySectionsDetails journey={journey} />
    </Disclosure>
  );
};

const MobileSearchResult: React.FC<Props> = ({ journey }) => {
  const t = useTranslations('add');

  return (
    <Disclosure as="li">
      <Disclosure.Button as={Fragment}>
        <div className="cursor-pointer space-y-2 py-5 px-4 transition hover:bg-gray-100">
          <JourneyHeader journey={journey} />
          <JourneyStopIndicator className="w-full" journey={journey} />
          <div className="flex justify-between">
            <p>
              {journey.transfers} {journey.transfers === 1 ? t('stop_one') : t('stop_other')},{' '}
              {parseDurationString(journey.duration)} min
            </p>
            <AddButton journey={journey} />
          </div>
        </div>
      </Disclosure.Button>
      <JourneySectionsDetails journey={journey} />
    </Disclosure>
  );
};

export const JourneySearchResult: React.FC<Props> = ({ journey }) => {
  const isDesktop = useBreakpoint('md');

  if (isDesktop) return <DesktopSearchResult journey={journey} />;

  return <MobileSearchResult journey={journey} />;
};
