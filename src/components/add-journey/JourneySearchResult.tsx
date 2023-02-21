import { Disclosure } from '@headlessui/react';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';
import { useBreakpoint } from 'react-breakout';

import { JourneySectionsDetails } from '@/components/add-journey/JourneySectionsDetails';
import { JourneyStopIndicator } from '@/components/add-journey/JourneyStopIndicator';
import type { Journey } from '@/types/opendata';
import { parseDurationString } from '@/utils/duration';
import { SaveJourneyButton } from '@/components/add-journey/SaveJourneyButton';

type Props = {
  journey: Journey;
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
            <p>{t('stops', { count: journey.transfers })}</p>
            <p>{parseDurationString(journey.duration)} min</p>
            <SaveJourneyButton journey={journey} />
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
              <p>{t('stops', { count: journey.transfers })}</p>
              {parseDurationString(journey.duration)} min
            </p>
            <SaveJourneyButton journey={journey} />
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
