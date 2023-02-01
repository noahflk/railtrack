import { useTranslations } from 'next-intl';
import { format, formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz';
import { subMinutes } from 'date-fns';

import { JourneySearchResult } from '@/components/add-journey/JourneySearchResult';
import { useJourneySearchStore } from '@/hooks/useJourneySearchStore';
import { useGetJourneys } from '@/hooks/useGetJourneys';
import type { Journey } from '@/types/opendata';
import { classNames } from '@/utils/styling';
import { APP_TIMEZONE } from '@/constants';

const HOUR_AND_HALF_IN_MINUTES = 90;
const generateJourneyKey = (journey: Journey) =>
  `${journey.from.departureTimestamp}${journey.from.departure}${journey.to.arrivalTimestamp}${journey.to.arrival}`;

const sortJourneys = (a: Journey, b: Journey) => a.from.departureTimestamp - b.from.departureTimestamp;

const unionJourneys = (journeys: Journey[], newJourneys: Journey[]) => {
  const concatJourneys = journeys.concat(newJourneys);
  const filteredJourneys = concatJourneys.filter(
    (item, idx) =>
      concatJourneys.map((journey) => journey.from.departureTimestamp).indexOf(item.from.departureTimestamp) === idx
  );
  return filteredJourneys.sort(sortJourneys);
};

const getEarliestAndLatestDepartureTime = (departureTime: string, journeys?: Journey[]) => {
  const departureTimeDate = new Date(zonedTimeToUtc(departureTime, APP_TIMEZONE));
  const departureTimestamps = (journeys || [])
    .map((journey) => journey.from.departureTimestamp)
    .concat(departureTimeDate.getTime() / 1000);

  const minTimestamp = departureTimestamps.length > 0 ? Math.min(...departureTimestamps) : undefined;
  const earliestDepartureTime = minTimestamp
    ? formatInTimeZone(new Date(minTimestamp * 1000), APP_TIMEZONE, "yyyy-MM-dd'T'HH:mm")
    : departureTime;
  const maxTimestamp = departureTimestamps.length > 0 ? Math.max(...departureTimestamps) : undefined;
  const latestDepartureTime = maxTimestamp
    ? formatInTimeZone(new Date(maxTimestamp * 1000), APP_TIMEZONE, "yyyy-MM-dd'T'HH:mm")
    : departureTime;
  return { earliestDepartureTime, latestDepartureTime };
};

const ResultDisplay: React.FC = () => {
  const journeys = useJourneySearchStore((state) => state.journeys);
  const setJourneys = useJourneySearchStore((state) => state.setJourneys);
  const departureTime = useJourneySearchStore((state) => state.departureTime);
  const departureStation = useJourneySearchStore((state) => state.departureStation);
  const arrivalStation = useJourneySearchStore((state) => state.arrivalStation);

  const { isLoading, mutateAsync } = useGetJourneys();
  const { earliestDepartureTime, latestDepartureTime } = getEarliestAndLatestDepartureTime(departureTime, journeys);

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
                setJourneys(unionJourneys(journeys, res));
              },
            }
          );
        }}
        className={classNames(
          'pl-4 text-sm font-medium md:pl-6',
          isLoading ? 'text-gray-500' : 'text-primary hover:text-primary-light'
        )}
      >
        {t('earlierJourneys')}
      </button>
      <ul role="list" className="divide-y">
        {journeys.map((journey) => (
          <JourneySearchResult key={generateJourneyKey(journey)} journey={journey} />
        ))}
      </ul>
      <button
        disabled={isLoading}
        onClick={() => {
          mutateAsync(
            { departureStation, arrivalStation, departureTime: latestDepartureTime },
            {
              onSuccess: (res) => {
                setJourneys(unionJourneys(journeys, res));
              },
            }
          );
        }}
        className={classNames(
          'pl-4 text-sm font-medium md:pl-6',
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
      <div className="h-full w-full py-4">
        <h3 className="pl-4 text-xl font-semibold text-gray-900 md:pl-6">{t('journeys')}</h3>
        <ResultDisplay />
      </div>
    </li>
  );
};
