import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useJourneySearchStore } from '@/hooks/useJourneySearchStore';
import type { Station } from '@/types/opendata';
import { getJourneys } from '@/utils/getJourneys';
import { classNames } from '@/utils/styling';

type Props = {
  departureTime: string;
  departureStation?: Station;
  arrivalStation?: Station;
  viaStation?: Station;
  className?: string;
};

export const SearchButton: React.FC<Props> = ({
  departureTime,
  departureStation,
  arrivalStation,
  viaStation,
  className,
}) => {
  const t = useTranslations('add');

  const setDepartureTime = useJourneySearchStore((state) => state.setDepartureTime);
  const setDepartureStation = useJourneySearchStore((state) => state.setDepartureStation);
  const setArrivalStation = useJourneySearchStore((state) => state.setArrivalStation);
  const setViaStation = useJourneySearchStore((state) => state.setViaStation);
  const setJourneys = useJourneySearchStore((state) => state.setJourneys);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={classNames('mt-1 flex w-full items-end', className)}>
      <Button
        className="w-full justify-center"
        onClick={async () => {
          if (departureStation && arrivalStation) {
            setDepartureTime(departureTime);
            setDepartureStation(departureStation);
            setArrivalStation(arrivalStation);

            if (viaStation) {
              setViaStation(viaStation);
            }

            try {
              setIsLoading(true);
              const journeys = await getJourneys({ departureStation, arrivalStation, viaStation, departureTime });
              setJourneys(journeys);
            } catch (error) {
              console.error(error);
              toast.error('Unable to load journey');
            } finally {
              setIsLoading(false);
            }
          }
        }}
      >
        {isLoading ? <LoadingSpinner /> : t('search')}
      </Button>
    </div>
  );
};
