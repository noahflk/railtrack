import { useTranslations } from 'next-intl';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useJourneySearchStore } from '@/hooks/useJourneySearchStore';
import type { Station } from '@/types/opendata';
import { useGetJourneys } from '@/hooks/useGetJourneys';
import { Button } from '@/components/Button';
import { classNames } from '@/utils/styling';

type Props = {
  departureTime: string;
  departureStation?: Station;
  arrivalStation?: Station;
  className?: string;
};

export const SearchButton: React.FC<Props> = ({ departureTime, departureStation, arrivalStation, className }) => {
  const { isLoading, mutateAsync } = useGetJourneys();
  const t = useTranslations('add');

  const setDepartureTime = useJourneySearchStore((state) => state.setDepartureTime);
  const setDepartureStation = useJourneySearchStore((state) => state.setDepartureStation);
  const setArrivalStation = useJourneySearchStore((state) => state.setArrivalStation);
  const setJourneys = useJourneySearchStore((state) => state.setJourneys);

  return (
    <div className={classNames('mt-1 flex w-full items-end', className)}>
      <Button
        className="w-full justify-center"
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
      >
        {isLoading ? <LoadingSpinner /> : t('search')}
      </Button>
    </div>
  );
};
