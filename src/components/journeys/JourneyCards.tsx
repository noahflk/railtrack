import { ArrowNarrowRightIcon } from '@heroicons/react/outline';
import { formatInTimeZone } from 'date-fns-tz';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { EmptyJourneyNotice } from '@/components/EmptyJourneyNotice';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Placeholder } from '@/components/Placeholder';
import { APP_TIMEZONE } from '@/constants';
import type { RouterOutputs } from '@/utils/trpc';
import { trpc } from '@/utils/trpc';

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
      <a
        href={`/journeys/${journey.uuid}`}
        onClick={(event) => {
          // if the delete button was clicked, don't navigate to the journey
          if ((event.target as HTMLInputElement).id === 'delete-button') {
            event.preventDefault();
          }
        }}
      >
        <div className="w-full p-6">
          <div className="mb-2 flex-1 font-semibold text-gray-900">
            <p className="break-all">
              {journey.departureStation} <ArrowNarrowRightIcon className="inline w-6 text-primary" />{' '}
              {journey.arrivalStation}
            </p>
            <p>{formatInTimeZone(departureTime, APP_TIMEZONE, 'dd.MM.yyyy')}</p>
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
              {journey.stops} {t('stops', { count: journey.stops })}
            </p>
            <div className="justify-end xs:flex">
              <button
                onClick={() => handleDelete(journey.id)}
                className="text-primary hover:text-primary-light"
                id="delete-button"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      </a>
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
  } = trpc.journey.getInfinite.useInfiniteQuery(
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
            <LoadingSpinner color="primary" />
          </div>
        </>
      )}
    </ul>
  );
};
