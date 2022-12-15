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
  const { isLoading, mutateAsync } = useGetJourneys();
  const t = useTranslations();

  const setDepartureTime = useJourneySearchStore((state) => state.setDepartureTime);
  const setDepartureStation = useJourneySearchStore((state) => state.setDepartureStation);
  const setArrivalStation = useJourneySearchStore((state) => state.setArrivalStation);
  const setJourneys = useJourneySearchStore((state) => state.setJourneys);

  return (
    <div className="mt-1 flex w-full items-end">
      <button
        onClick={() => {
          if (departureStation && arrivalStation) {
            setDepartureTime(departureTime);
            setDepartureStation(departureStation);
            setArrivalStation(arrivalStation);
            mutateAsync(
              { departureStation, arrivalStation, departureTime },
              {
                onSuccess: (res) => {
                  setJourneys(res);
                },
              }
            );
          }
        }}
        className="flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {isLoading ? <LoadingSpinner /> : t('add.search')}
      </button>
    </div>
  );
};
