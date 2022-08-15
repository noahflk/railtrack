import axios from 'axios';
import { useThrottleState } from 'react-relaxed';
import toast from 'react-hot-toast';
import { useTranslation } from 'next-i18next';

import { StationSearchField } from '@/components/add-journey/StationSearchField';
import { DepartureTimeField } from '@/components/add-journey/DepartureTimeField';
import { useJourneySearchStore } from '@/hooks/useJourneySearchStore';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { TRANSPORT_API_URL } from '@/constants';

export const JourneySearchForm: React.FC = () => {
  const departureTime = useJourneySearchStore((state) => state.departureTime);
  const departureStation = useJourneySearchStore((state) => state.departureStation);
  const arrivalStation = useJourneySearchStore((state) => state.arrivalStation);
  const setDepartureStation = useJourneySearchStore((state) => state.setDepartureStation);
  const setArrivalStation = useJourneySearchStore((state) => state.setArrivalStation);
  const setConnections = useJourneySearchStore((state) => state.setConnections);

  const { t } = useTranslation('add-journey');

  const [, setLoading, loading] = useThrottleState(false, 150);

  const getConnections = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${TRANSPORT_API_URL}/connections?from=${departureStation?.name}&to=${arrivalStation?.name}&date=${
          departureTime.split('T')[0]
        }&time=${departureTime.split('T')[1]}`
      );

      setConnections(data.connections);
    } catch (error) {
      toast.error('Unable to load connections');
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className="col-span-1 bg-white divide-y divide-gray-200 rounded-lg shadow">
      <div className="w-full p-6 space-y-6 ">
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
        <button
          onClick={getConnections}
          className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {loading ? <LoadingSpinner /> : t('search')}
        </button>
      </div>
    </li>
  );
};
