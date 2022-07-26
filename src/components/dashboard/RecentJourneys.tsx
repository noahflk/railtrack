import { Journey } from '@/components/dashboard/Journey';
import { EmptyJourneyNotice } from '@/components/EmptyJourneyNotice';
import { Link } from '@/components/Link';
import { trpc } from '@/utils/trpc';

const RecentJourneysWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="col-span-1 p-4 bg-white rounded-lg shadow">
    <h3 className="text-xl font-medium text-gray-900">Recent journeys</h3>
    {children}
  </div>
);

export const RecentJourneys: React.FC = () => {
  const FETCH_CONNECTION_LIMIT = 7;

  const { data: connections } = trpc.useQuery(['connection.get', FETCH_CONNECTION_LIMIT]);

  if (!connections)
    return (
      <RecentJourneysWrapper>
        <div className="w-full pt-4 space-y-4 animate-pulse ">
          <div className="h-6 bg-gray-300 rounded-md "></div>
          <div className="h-6 bg-gray-300 rounded-md "></div>
          <div className="h-6 bg-gray-300 rounded-md "></div>
        </div>
      </RecentJourneysWrapper>
    );

  const sortedConnections = connections.sort((a, b) => b.departureTime.getTime() - a.departureTime.getTime());

  if (sortedConnections.length === 0)
    return (
      <RecentJourneysWrapper>
        <EmptyJourneyNotice />
      </RecentJourneysWrapper>
    );

  return (
    <RecentJourneysWrapper>
      <div className="flex flex-col justify-between h-full pb-5">
        <ul>
          {sortedConnections.map((connection) => (
            <Journey key={connection.id} journey={connection} />
          ))}
        </ul>
        <div className="p-1">
          <Link href="/journeys">See all journeys</Link>
        </div>
      </div>
    </RecentJourneysWrapper>
  );
};
