import { Journey } from '@/types/journey';

type RowProps = {
  journey: Journey;
  handleDelete: (id: number) => void;
};

const JourneyRow: React.FC<RowProps> = ({ journey, handleDelete }) => (
  <tr>
    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">{journey.departureStation}</td>
    <td className="px-3 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{journey.arrivalStation}</td>
    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{journey.distance} km</td>
    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{journey.duration} minutes</td>
    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{journey.stops}</td>
    <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
      <button onClick={() => handleDelete(journey.id)} className="text-primary hover:text-primary-light">
        Delete
      </button>
    </td>
  </tr>
);

type TableProps = {
  journeys: Journey[];
  handleDelete: (id: number) => void;
};

const JourneyTable: React.FC<TableProps> = ({ journeys, handleDelete }) => (
  <div className="flex flex-col">
    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Departure
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Destination
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Distance
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Duration
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Stops
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {journeys.map((journey) => (
                <JourneyRow journey={journey} key={journey.id} handleDelete={handleDelete} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default JourneyTable;
