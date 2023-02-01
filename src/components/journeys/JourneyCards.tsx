import { useEffect } from 'react';
import { ArrowNarrowRightIcon } from '@heroicons/react/outline';
import { useTranslations } from 'next-intl';
import { useInView } from 'react-intersection-observer';
import { formatInTimeZone } from 'date-fns-tz';

import { trpc } from '@/utils/trpc';
import { TextButton } from '@/components/TextButton';
import type { RouterOutputs } from '@/utils/trpc';
import { Placeholder } from '@/components/Placeholder';
import { EmptyJourneyNotice } from '@/components/EmptyJourneyNotice';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { APP_TIMEZONE } from '@/constants';

type CardProps = {
  // the [number] ensures we only get the item type without the array
  journey: RouterOutputs['journey']['get'][number];
  handleDelete: (id: number) => void;
};

const JourneyCard: React.FC<CardProps> = ({ journey, handleDelete }) => {
  const departureTime = new Date(journey.departureTime);
  const arrivalTime = new Date(journey.arrivalTime);
  const t = useTranslations('journeys');

  return (
    <li className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
      <div className="w-full p-6">
        <div className="mb-2 grid flex-1 grid-cols-1 gap-2 truncate font-semibold text-gray-900 xs:grid-cols-2">
          <div>
            <p>
              {journey.departureStation} <ArrowNarrowRightIcon className="inline w-6 text-primary" />{' '}
              {journey.arrivalStation}
            </p>
          </div>
          <div>
            <p className="xs:text-right">{formatInTimeZone(departureTime, APP_TIMEZONE, 'dd.MM.yyyy')}</p>
          </div>
        </div>
        <div>
          <p>
            {formatInTimeZone(departureTime, APP_TIMEZONE, 'HH:mm')} -{' '}
            {formatInTimeZone(arrivalTime, APP_TIMEZONE, 'HH:mm')}
          </p>
          <p>
            {t('duration')}: {journey.duration} {t(journey.duration === 1 ? 'minutes_one' : 'minutes_other')}
          </p>
          <p>
            {t('distance')}: {journey.distance} km{' '}
          </p>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-2 truncate xs:grid-cols-2">
          <p>
            {journey.stops} {t(journey.stops === 1 ? 'stops_one' : 'stops_other')}
          </p>
          <div className="justify-end xs:flex">
            <TextButton onClick={() => handleDelete(journey.id)}>{t('delete')}</TextButton>
          </div>
        </div>
      </div>
    </li>
  );
};

type Props = {
  handleDelete: (id: number) => void;
};

export const JourneyCards: React.FC<Props> = ({ handleDelete }) => {
  const { inView, ref } = useInView();

  const {
    data: journeys,
    fetchNextPage,
    hasNextPage,
  } = trpc.infiniteJourneys.get.useInfiniteQuery(
    {
      limit: 6,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? false,
    }
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (!journeys) return <Placeholder />;

  const hasEmptyJourneyList = journeys.pages.some((page) => page.journeyList.length === 0);

  if (hasEmptyJourneyList) {
    return (
      <div className="pt-12">
        <EmptyJourneyNotice />
      </div>
    );
  }

  return (
    <ul role="list" className="space-y-4">
      {journeys?.pages.map((page) =>
        page.journeyList.flatMap((journey) => (
          <JourneyCard key={journey.id} journey={journey} handleDelete={handleDelete} />
        ))
      )}
      {hasNextPage && (
        <>
          <div ref={ref} className="mt-4 flex justify-center">
            <LoadingSpinner />
          </div>
        </>
      )}
    </ul>
  );
};
