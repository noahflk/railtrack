import type { GetServerSideProps, NextPage } from 'next';

import { Wrapper } from '@/components/Wrapper';
import { RecentJourneys } from '@/components/dashboard/RecentJourneys';
import { StatsDisplay } from '@/components/dashboard/StatsDisplay';
// import { JourneyMap } from '@/components/dashboard/JourneyMap';
import { protectedRoute } from '@/utils/protected';

const Dashboard: NextPage = () => {
  return (
    <Wrapper title="Dashboard">
      <StatsDisplay />
      <div className="grid grid-cols-1 gap-6 mt-4 xl:grid-cols-3">
        <RecentJourneys />
        {/* <JourneyMap /> */}
      </div>
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return protectedRoute(req);
};

export default Dashboard;
