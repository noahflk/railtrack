import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { Wrapper } from '@/components/Wrapper';
import { JourneyList } from '@/components/journeys/JourneyList';
import { protectedRoute } from '@/utils/protected';

const Journeys: NextPage = () => {
  const { t } = useTranslation('common');

  return (
    <Wrapper title={t('journeys')}>
      <JourneyList />
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  return {
    ...(await protectedRoute(req)),
    props: {
      ...(await serverSideTranslations(locale ?? '', ['common', 'journeys'])),
    },
  };
};

export default Journeys;
