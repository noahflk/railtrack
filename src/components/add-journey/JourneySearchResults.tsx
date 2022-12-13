import { useTranslations } from 'next-intl';
import { format } from 'date-fns-tz';
import { subMinutes, addMinutes } from 'date-fns';

import { JourneySearchResult } from '@/components/add-journey/JourneySearchResult';
import { useJourneySearchStore } from '@/hooks/useJourneySearchStore';
import { useGetJourneys } from '@/hooks/useGetJourneys';
import type { Journey } from '@/types/opendata';
import { classNames } from '@/utils/styling';

const HOUR_AND_HALF_IN_MINUTES = 90;
const generateJourneyKey = (journey: Journey) => {
  return `${journey.from.departureTimestamp}${journey.from.departure}${journey.to.arrivalTimestamp}${journey.to.arrival}`;
};

const ResultDisplay: React.FC = () => {
  const journeys = useJourneySearchStore((state) => state.journeys);
  const departureTime = useJourneySearchStore((state) => state.departureTime);
  const setDepartureTime = useJourneySearchStore((state) => state.setDepartureTime);
  const { isFetching, refetch: getJourneys } = useGetJourneys();

  const t = useTranslations('add');

  if (!journeys) {
    return (
      <div className="flex h-full items-center justify-center pb-10">
        <p>{t('searchFor')}</p>
      </div>
    );
  }

  if (journeys.length === 0) {
    return (
      <div className="flex h-full items-center justify-center pb-6">
        <p>{t('notFound')}</p>
      </div>
    );
  }

  return (
    <>
      <button
        disabled={isFetching}
        onClick={() => {
          // Subtracts 1.5 hours to the current departureTime
          const newDepartureTime = subMinutes(new Date(departureTime), HOUR_AND_HALF_IN_MINUTES);
          const formattedDepartureTime = format(newDepartureTime, "yyyy-MM-dd'T'HH:mm");
          setDepartureTime(formattedDepartureTime);
          getJourneys();
        }}
        className={classNames(
          'text-sm font-medium',
          isFetching ? 'text-gray-500' : 'text-primary hover:text-primary-light'
        )}
      >
        {t('earlierJourneys')}
      </button>
      <ul role="list">
        {journeys.map((journey) => (
          <JourneySearchResult key={generateJourneyKey(journey)} journey={journey} />
        ))}
      </ul>
      <button
        disabled={isFetching}
        onClick={() => {
          // Adds 2 hours to the current departureTime
          const newDepartureTime = addMinutes(new Date(departureTime), HOUR_AND_HALF_IN_MINUTES);
          const formattedDepartureTime = format(newDepartureTime, "yyyy-MM-dd'T'HH:mm");
          setDepartureTime(formattedDepartureTime);
          getJourneys();
        }}
        className={classNames(
          'text-sm font-medium',
          isFetching ? 'text-gray-500' : 'text-primary hover:text-primary-light'
        )}
      >
        {t('laterJourneys')}
      </button>
    </>
  );
};

export const JourneySearchResults: React.FC = () => {
  const t = useTranslations('add');

  return (
    <li className="divide-gray-200npm col-span-1 divide-y rounded-lg bg-white shadow ">
      <div className="h-full w-full p-6">
        <h3 className="text-xl font-semibold text-gray-900">{t('journeys')}</h3>
        <ResultDisplay />
      </div>
    </li>
  );
};
