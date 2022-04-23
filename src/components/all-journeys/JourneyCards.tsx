import { ArrowNarrowRightIcon } from '@heroicons/react/outline';

import TextButton from '@/components/TextButton';
import { Journey } from '@/types/journey';
import { format } from 'date-fns';

type CardProps = {
  journey: Journey;
  handleDelete: (id: number) => void;
};

const JourneyCard: React.FC<CardProps> = ({ journey, handleDelete }) => {
  const departureTime = new Date(journey.departureTime);
  const arrivalTime = new Date(journey.arrivalTime);

  return (
    <li className="col-span-1 bg-white divide-y divide-gray-200 rounded-lg shadow">
      <div className="w-full p-6">
        <div className="grid flex-1 grid-cols-1 gap-2 mb-2 font-semibold text-gray-900 truncate xs:grid-cols-2">
          <div>
            <p>
              {journey.departureStation} <ArrowNarrowRightIcon className="inline w-6 text-primary" /> {journey.arrivalStation}
            </p>
          </div>
          <div>
            <p className="xs:text-right">{format(departureTime, 'dd.MM.yyyy')}</p>
          </div>
        </div>
        <div>
          <p>
            {format(departureTime, 'HH:mm')} - {format(arrivalTime, 'HH:mm')}
          </p>
          <p>Duration: {journey.duration} minutes</p>
          <p>Distance: {journey.distance} km </p>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-2 truncate xs:grid-cols-2">
          <p>
            {journey.stops} {journey.stops === 1 ? 'stop' : 'stops'}
          </p>
          <div className="justify-end xs:flex">
            <TextButton onClick={() => handleDelete(journey.id)}>Delete</TextButton>
          </div>
        </div>
      </div>
    </li>
  );
};

type Props = {
  journeys: Journey[];
  handleDelete: (id: number) => void;
};

const JourneyCards: React.FC<Props> = ({ journeys, handleDelete }) => (
  <ul role="list" className="space-y-4">
    {journeys.map((journey) => (
      <JourneyCard key={journey.id} journey={journey} handleDelete={handleDelete} />
    ))}
  </ul>
);

export default JourneyCards;
