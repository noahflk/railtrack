type Props = {
  journey: any;
  onDelete: (id: number) => void;
};

const JourneyRow: React.FC<Props> = ({ journey, onDelete }) => (
  <tr>
    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">{journey.departureStation}</td>
    <td className="px-3 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{journey.arrivalStation}</td>
    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{journey.distance} km</td>
    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{journey.duration} minutes</td>
    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{journey.stops}</td>
    <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
      <button onClick={() => onDelete(journey.id)} className="text-primary hover:text-primary-light">
        Delete
      </button>
    </td>
  </tr>
);

export default JourneyRow;
