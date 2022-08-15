import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

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

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  return {
    ...(await protectedRoute(req)),
    props: {
      ...(await serverSideTranslations(locale ?? '', ['common'])),
    },
  };
};

export default Journeys;
