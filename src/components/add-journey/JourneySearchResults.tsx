import { useState } from 'react';
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

const sortJourneys = (a: Journey, b: Journey) => {
  return a.from.departureTimestamp - b.from.departureTimestamp;
};

const unionJourneys = (journeys: Journey[], newJourneys: Journey[]) => {
  const concatJourneys = journeys.concat(newJourneys);
  const filteredJourneys = concatJourneys.filter(
    (item, idx) =>
      concatJourneys.map((journey) => journey.from.departureTimestamp).indexOf(item.from.departureTimestamp) === idx
  );
  return filteredJourneys.sort(sortJourneys);
};

const ResultDisplay: React.FC = () => {
  const journeys = useJourneySearchStore((state) => state.journeys);
  const setJourneys = useJourneySearchStore((state) => state.setJourneys);
  const departureTime = useJourneySearchStore((state) => state.departureTime);
  const departureStation = useJourneySearchStore((state) => state.departureStation);
  const arrivalStation = useJourneySearchStore((state) => state.arrivalStation);

  const { isLoading, mutateAsync } = useGetJourneys();
  const [earliestDepartureTime, setEarliestDepartureTime] = useState(departureTime);
  const [latestDepartureTime, setLatestDepartureTime] = useState(departureTime);

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
        disabled={isLoading}
        onClick={() => {
          // Subtracts 1.5 hours to the earliest departureTime
          const newDepartureTime = format(
            subMinutes(new Date(earliestDepartureTime), HOUR_AND_HALF_IN_MINUTES),
            "yyyy-MM-dd'T'HH:mm"
          );
          mutateAsync(
            { departureStation, arrivalStation, departureTime: newDepartureTime },
            {
              onSuccess: (res) => {
                const newJourneys = unionJourneys(journeys, res);
                setEarliestDepartureTime(newDepartureTime);
                setJourneys(newJourneys);
              },
            }
          );
        }}
        className={classNames(
          'text-sm font-medium',
          isLoading ? 'text-gray-500' : 'text-primary hover:text-primary-light'
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
        disabled={isLoading}
        onClick={() => {
          // Adds 1.5 hours to the latest departureTime
          const newDepartureTime = format(
            addMinutes(new Date(latestDepartureTime), HOUR_AND_HALF_IN_MINUTES),
            "yyyy-MM-dd'T'HH:mm"
          );
          mutateAsync(
            { departureStation, arrivalStation, departureTime: newDepartureTime },
            {
              onSuccess: (res) => {
                setLatestDepartureTime(newDepartureTime);
                setJourneys(unionJourneys(journeys, res));
              },
            }
          );
        }}
        className={classNames(
          'text-sm font-medium',
          isLoading ? 'text-gray-500' : 'text-primary hover:text-primary-light'
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
