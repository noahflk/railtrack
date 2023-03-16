import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';

import { EmptyJourneyNotice } from '@/components/EmptyJourneyNotice';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Placeholder } from '@/components/Placeholder';
import { APP_TIMEZONE } from '@/constants';
import type { RouterOutputs } from '@/utils/trpc';
import { trpc } from '@/utils/trpc';

type RowProps = {
  journey: RouterOutputs['journey']['get'][number];
  handleDelete: (id: number) => void;
};

const JourneyRow: React.FC<RowProps> = ({ journey, handleDelete }) => {
  const router = useRouter();

  const departureTime = new Date(journey.departureTime);
  const arrivalTime = new Date(journey.arrivalTime);

  const t = useTranslations('journeys');

  return (
    <tr
      onClick={(event) => {
        // if the delete button was clicked, don't navigate to the journey
        if ((event.target as HTMLInputElement).id !== 'delete-button') {
          router.push(`/journeys/${journey.uuid}`);
        }
      }}
      className="hover:cursor-pointer hover:bg-gray-50"
    >
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        {format(departureTime, 'dd.MM.yyyy')}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {journey.departureStation} ({formatInTimeZone(departureTime, APP_TIMEZONE, 'HH:mm')})
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {journey.arrivalStation} ({formatInTimeZone(arrivalTime, APP_TIMEZONE, 'HH:mm')})
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{journey.distance} km</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{t('minutes', { count: journey.duration })}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{journey.stops}</td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <button
          onClick={() => handleDelete(journey.id)}
          className="text-primary hover:text-primary-light"
          id="delete-button"
        >
          {t('delete')}
        </button>
      </td>
    </tr>
  );
};

type TableProps = {
  handleDelete: (id: number) => void;
};

export const JourneyTable: React.FC<TableProps> = ({ handleDelete }) => {
  const t = useTranslations();
  const { inView, ref } = useInView();

  const {
    data: journeys,
    fetchNextPage,
    hasNextPage,
  } = trpc.journey.getInfinite.useInfiniteQuery(
    {
      limit: 13,
    },
    {
      retry: 2,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? false,
      onError: () => toast.error(t('journeys.loadJourneysError')),
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
    <div className="flex flex-col">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    {t('journeys.date')}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t('departure')}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t('arrival')}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t('journeys.distance')}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t('journeys.duration')}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t('journeys.stop_title')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {journeys?.pages.map((page) =>
                  page.journeyList.flatMap((journey) => (
                    <JourneyRow key={journey.id} journey={journey} handleDelete={handleDelete} />
                  ))
                )}
              </tbody>
            </table>
          </div>
          {hasNextPage && (
            <>
              <div ref={ref} className="mt-4 flex justify-center">
                <LoadingSpinner color="primary" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
