import { ArrowNarrowRightIcon } from '@heroicons/react/outline';
import { useTranslations } from 'next-intl';

import { JourneySearchResult } from '@/components/add-journey/JourneySearchResult';
import { useJourneySearchStore } from '@/hooks/useJourneySearchStore';
import type { Connection } from '@/types/opendata';

const generateJourneyKey = (connection: Connection) => {
  return `${connection.from.departureTimestamp}${connection.from.departure}${connection.to.arrivalTimestamp}${connection.to.arrival}`;
};

const ResultDisplay: React.FC = () => {
  const connections = useJourneySearchStore((state) => state.connections);

  const t = useTranslations('add');

  if (!connections) {
    return (
      <div className="flex items-center justify-center h-full pb-10">
        <p>{t('searchFor')}</p>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="flex items-center justify-center h-full pb-6">
        <p>{t('notFound')}</p>
      </div>
    );
  }

  return (
    <ul role="list">
      {connections.map((connection) => (
        <JourneySearchResult key={generateJourneyKey(connection)} connection={connection} />
      ))}
    </ul>
  );
};

export const JourneySearchResults: React.FC = () => {
  const departureStation = useJourneySearchStore((state) => state.departureStation);
  const arrivalStation = useJourneySearchStore((state) => state.arrivalStation);

  const t = useTranslations('add');

  return (
    <li className="col-span-1 bg-white divide-y rounded-lg shadow divide-gray-200npm ">
      <div className="w-full h-full p-6">
        <h3 className="text-xl font-semibold text-gray-900">{t('connections')}</h3>
        {departureStation && arrivalStation && (
          <p className="font-medium text-gray-900 ">
            {departureStation.name} <ArrowNarrowRightIcon className="inline w-6 mx-2 text-primary" />{' '}
            {arrivalStation.name}
          </p>
        )}
        <ResultDisplay />
      </div>
    </li>
  );
};
