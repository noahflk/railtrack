import useRecentJourneys from '@/hooks/useRecentJourneys';
import Journey from '@/components/dashboard/Journey';
import EmptyJourneyNotice from '@/components/EmptyJourneyNotice';
import { Link } from '@/components/Link';
import { sortJourneysLatestFirst } from '@/utils/sorters';

const RecentJourneysWrapper: React.FC = ({ children }) => (
  <div className="col-span-1 p-4 bg-white rounded-lg shadow">
    <h3 className="text-xl font-medium text-gray-900">Recent journeys</h3>
    {children}
  </div>
);

const RecentJourneys: React.FC = () => {
  const { data: journeys } = useRecentJourneys();

  if (!journeys)
    return (
      <RecentJourneysWrapper>
        <div className="w-full pt-4 space-y-4 animate-pulse ">
          <div className="h-6 bg-gray-300 rounded-md "></div>
          <div className="h-6 bg-gray-300 rounded-md "></div>
          <div className="h-6 bg-gray-300 rounded-md "></div>
        </div>
      </RecentJourneysWrapper>
    );

  const sortedJourneys = sortJourneysLatestFirst(journeys);

  if (sortedJourneys.length === 0)
    return (
      <RecentJourneysWrapper>
        <EmptyJourneyNotice />
      </RecentJourneysWrapper>
    );

  return (
    <RecentJourneysWrapper>
      <div className="flex flex-col justify-between h-full pb-5">
        <ul>
          {sortedJourneys.map((journey) => (
            <Journey key={journey.id} journey={journey} />
          ))}
        </ul>
        <div className="p-1">
          <Link href="/journeys">See all journeys</Link>
        </div>
      </div>
    </RecentJourneysWrapper>
  );
};

export default RecentJourneys;
