import axios from 'axios';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { useThrottleState } from 'react-relaxed';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useJourneySearchStore } from '@/hooks/useJourneySearchStore';
import { TRANSPORT_API_URL } from '@/constants';
import type { Journey } from '@/types/opendata';

export const SearchButton: React.FC = () => {
  const departureTime = useJourneySearchStore((state) => state.departureTime);
  const departureStation = useJourneySearchStore((state) => state.departureStation);
  const arrivalStation = useJourneySearchStore((state) => state.arrivalStation);
  const setJourneys = useJourneySearchStore((state) => state.setJourneys);

  const [, setLoading, loading] = useThrottleState(false, 150);

  const t = useTranslations();

  const getJourneys = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get<{ connections: Journey[] }>(
        `${TRANSPORT_API_URL}/connections?from=${departureStation?.name}&to=${arrivalStation?.name}&date=${
          departureTime.split('T')[0]
        }&time=${departureTime.split('T')[1]}`
      );

      setJourneys(data.connections);
    } catch (error) {
      toast.error('Unable to load journeys');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-end w-full mt-1">
      <button
        onClick={getJourneys}
        className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        {loading ? <LoadingSpinner /> : t('add.search')}
      </button>
    </div>
  );
};
