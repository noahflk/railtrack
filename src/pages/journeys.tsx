import { GetServerSideProps, NextPage } from 'next';

import { Wrapper } from '@/components/Wrapper';
import { JourneyList } from '@/components/journeys/JourneyList';
import { protectedRoute } from '@/utils/protected';

const Journeys: NextPage = () => {
  return (
    <Wrapper title="Journeys">
      <JourneyList />
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return protectedRoute(req);
};

export default Journeys;
