import { useTranslations } from 'next-intl';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useJourneySearchStore } from '@/hooks/useJourneySearchStore';
import type { Station } from '@/types/opendata';
import { useGetJourneys } from '@/hooks/useGetJourneys';

type Props = {
  departureTime: string;
  departureStation?: Station;
  arrivalStation?: Station;
};

export const SearchButton: React.FC<Props> = ({ departureTime, departureStation, arrivalStation }) => {
  const { isFetching } = useGetJourneys();
  const t = useTranslations();

  const setDepartureTime = useJourneySearchStore((state) => state.setDepartureTime);
  const setDepartureStation = useJourneySearchStore((state) => state.setDepartureStation);
  const setArrivalStation = useJourneySearchStore((state) => state.setArrivalStation);

  return (
    <div className="mt-1 flex w-full items-end">
      <button
        onClick={() => {
          setDepartureTime(departureTime);
          if (departureStation) {
            setDepartureStation(departureStation);
          }
          if (arrivalStation) {
            setArrivalStation(arrivalStation);
          }
        }}
        className="flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {isFetching ? <LoadingSpinner /> : t('add.search')}
      </button>
    </div>
  );
};
