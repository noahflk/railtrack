import { PlusIcon } from '@heroicons/react/outline';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { DepartureOrArrivalTimeToggle } from '@/components/add-journey/DepartureOrArrivalTimeToggle';
import { DepartureTimeField } from '@/components/add-journey/DepartureTimeField';
import { SearchButton } from '@/components/add-journey/SearchButton';
import { StationSearchField } from '@/components/add-journey/StationSearchField';
import { useJourneySearchStore } from '@/hooks/useJourneySearchStore';
import { DEFAULT_IS_ARRIVAL } from '@/utils/getJourneys';
import { classNames } from '@/utils/styling';

export const JourneySearchForm: React.FC = () => {
  const storeDepartureStation = useJourneySearchStore((state) => state.departureStation);
  const storeArrivalStation = useJourneySearchStore((state) => state.arrivalStation);
  const storeViaStation = useJourneySearchStore((state) => state.viaStation);
  const storeDepartureTime = useJourneySearchStore((state) => state.departureTime);

  const [departureTime, setDepartureTime] = useState(storeDepartureTime);
  const [departureStation, setDepartureStation] = useState(storeDepartureStation);
  const [arrivalStation, setArrivalStation] = useState(storeArrivalStation);
  const [viaStation, setViaStation] = useState(storeViaStation);
  const [isArrival, setIsArrival] = useState(DEFAULT_IS_ARRIVAL);
  const [showVia, setShowVia] = useState(false);

  useEffect(() => {
    setDepartureTime(storeDepartureTime);
  }, [storeDepartureTime]);

  const t = useTranslations();

  return (
    <li className="col-span-1 rounded-lg bg-white shadow">
      <div className="grid w-full grid-rows-3 gap-6 p-6 lg:grid-cols-6 lg:grid-rows-2">
        <StationSearchField
          className={classNames('col-span-3', showVia && 'lg:col-span-2')}
          label={t('departure')}
          setSelectedStation={setDepartureStation}
        />
        <StationSearchField
          className={classNames('col-span-3', showVia && 'lg:col-span-2')}
          label={t('arrival')}
          setSelectedStation={setArrivalStation}
          secondaryElement={
            !showVia && (
              <button
                className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-light"
                onClick={() => setShowVia(true)}
              >
                <span>Via</span> <PlusIcon className="h-4 w-4" />
              </button>
            )
          }
        />
        {showVia && (
          <StationSearchField
            className="col-span-3 lg:col-span-2"
            label="Via (optional)"
            setSelectedStation={setViaStation}
          />
        )}
        <div className="col-span-3 flex items-center gap-2">
          <DepartureTimeField departureTime={departureTime} setDepartureTime={setDepartureTime} />
          <DepartureOrArrivalTimeToggle className="mt-4" setIsArrival={setIsArrival} isArrival={isArrival} />
        </div>
        <SearchButton
          className="col-span-3"
          departureTime={departureTime}
          departureStation={departureStation}
          arrivalStation={arrivalStation}
          viaStation={viaStation}
          isArrival={isArrival}
        />
      </div>
    </li>
  );
};
