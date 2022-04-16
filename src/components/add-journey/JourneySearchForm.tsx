import axios from 'axios';

import StationSearchField from '@/components/add-journey/StationSearchField';
import DepartureTimeField from '@/components/add-journey/DepartureTimeField';
import useJourneySearchStore from '@/hooks/useJourneySearchStore';

const JourneySearchForm: React.FC = () => {
  const departureTime = useJourneySearchStore((state) => state.departureTime);
  const departureStation = useJourneySearchStore((state) => state.departureStation);
  const arrivalStation = useJourneySearchStore((state) => state.arrivalStation);
  const setDepartureStation = useJourneySearchStore((state) => state.setDepartureStation);
  const setArrivalStation = useJourneySearchStore((state) => state.setArrivalStation);
  const setConnections = useJourneySearchStore((state) => state.setConnections);

  const getConnections = async () => {
    const { data } = await axios.get(
      `https://transport.opendata.ch/v1/connections?from=${departureStation?.name}&to=${arrivalStation?.name}&date=${
        departureTime.split('T')[0]
      }&time=${departureTime.split('T')[1]}`
    );

    setConnections(data.connections);
  };

  return (
    <li className="col-span-1 bg-white divide-y divide-gray-200 rounded-lg shadow">
      <div className="w-full p-6 space-y-6 ">
        <StationSearchField label="Departure station" selectedStation={departureStation} setSelectedStation={setDepartureStation} />
        <StationSearchField label="Arrival station" selectedStation={arrivalStation} setSelectedStation={setArrivalStation} />
        <DepartureTimeField />
        <button
          onClick={getConnections}
          className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Search Connections
        </button>
      </div>
    </li>
  );
};

export default JourneySearchForm;
