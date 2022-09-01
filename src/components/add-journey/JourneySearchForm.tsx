import { useTranslations } from 'next-intl';

import { DepartureTimeField } from '@/components/add-journey/DepartureTimeField';
import { StationSearchField } from '@/components/add-journey/StationSearchField';
import { SearchButton } from '@/components/add-journey/SearchButton';
import { useJourneySearchStore } from '@/hooks/useJourneySearchStore';

export const JourneySearchForm: React.FC = () => {
  const departureStation = useJourneySearchStore((state) => state.departureStation);
  const arrivalStation = useJourneySearchStore((state) => state.arrivalStation);
  const setDepartureStation = useJourneySearchStore((state) => state.setDepartureStation);
  const setArrivalStation = useJourneySearchStore((state) => state.setArrivalStation);

  const t = useTranslations();

  return (
    <li className="col-span-1 bg-white rounded-lg shadow">
      <div className="grid w-full grid-rows-1 gap-6 p-6 lg:grid-cols-2">
        <StationSearchField
          label={t('departure')}
          selectedStation={departureStation}
          setSelectedStation={setDepartureStation}
        />
        <StationSearchField
          label={t('arrival')}
          selectedStation={arrivalStation}
          setSelectedStation={setArrivalStation}
        />
        <DepartureTimeField />
        <SearchButton />
      </div>
    </li>
  );
};
