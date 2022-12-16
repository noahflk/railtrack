import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { DepartureTimeField } from '@/components/add-journey/DepartureTimeField';
import { StationSearchField } from '@/components/add-journey/StationSearchField';
import { SearchButton } from '@/components/add-journey/SearchButton';
import { useJourneySearchStore } from '@/hooks/useJourneySearchStore';

export const JourneySearchForm: React.FC = () => {
  const storeDepartureStation = useJourneySearchStore((state) => state.departureStation);
  const storeArrivalStation = useJourneySearchStore((state) => state.arrivalStation);
  const storeDepartureTime = useJourneySearchStore((state) => state.departureTime);

  const [departureTime, setDepartureTime] = useState(storeDepartureTime);
  const [departureStation, setDepartureStation] = useState(storeDepartureStation);
  const [arrivalStation, setArrivalStation] = useState(storeArrivalStation);

  useEffect(() => {
    setDepartureTime(storeDepartureTime);
  }, [storeDepartureTime]);

  const t = useTranslations();

  return (
    <li className="col-span-1 rounded-lg bg-white shadow">
      <div className="grid w-full grid-rows-1 gap-6 p-6 lg:grid-cols-2">
        <StationSearchField label={t('departure')} setSelectedStation={setDepartureStation} />
        <StationSearchField label={t('arrival')} setSelectedStation={setArrivalStation} />
        <DepartureTimeField departureTime={departureTime} setDepartureTime={setDepartureTime} />
        <SearchButton
          departureTime={departureTime}
          departureStation={departureStation}
          arrivalStation={arrivalStation}
        />
      </div>
    </li>
  );
};
