import { ArrowNarrowRightIcon } from '@heroicons/react/outline';

import JourneySearchResult from '@/components/add-journey/JourneySearchResult';
import useJourneySearchStore from '@/hooks/useJourneySearchStore';

const JourneySearchResults: React.FC = () => {
  const departureStation = useJourneySearchStore((state) => state.departureStation);
  const arrivalStation = useJourneySearchStore((state) => state.arrivalStation);
  const connections = useJourneySearchStore((state) => state.connections);

  return (
    <li className="col-span-1 bg-white divide-y rounded-lg shadow divide-gray-200npm ">
      <div className="w-full h-full p-6">
        <h3 className="text-xl font-semibold text-gray-900">Connections</h3>
        {departureStation && arrivalStation && (
          <p className="font-medium text-gray-900 ">
            {departureStation.name} <ArrowNarrowRightIcon className="inline w-6 mx-2 text-primary" /> {arrivalStation.name}
          </p>
        )}
        {connections.length > 0 ? (
          <ul role="list">
            {connections.map((connection) => (
              <JourneySearchResult
                key={`${connection.from.departure}${connection.to.arrival}${connection.duration}`}
                connection={connection}
              />
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full pb-6">
            <p>Search for a connection</p>
          </div>
        )}
      </div>
    </li>
  );
};

export default JourneySearchResults;
