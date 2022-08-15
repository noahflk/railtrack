import type { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { JourneyMap } from '@/components/dashboard/JourneyMap';
import { RecentJourneys } from '@/components/dashboard/RecentJourneys';
import { StatsDisplay } from '@/components/dashboard/StatsDisplay';
import { Wrapper } from '@/components/Wrapper';
import { protectedRoute } from '@/utils/protected';

const Dashboard: NextPage = () => {
  const { t } = useTranslation('common');

  return (
    <Wrapper title={t('dashboard')}>
      <StatsDisplay />
      <div className="grid grid-cols-1 gap-6 mt-4 xl:grid-cols-3">
        <RecentJourneys />
        <JourneyMap />
      </div>
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  return {
    ...(await protectedRoute(req)),
    props: {
      ...(await serverSideTranslations(locale ?? '', ['common', 'dashboard'])),
    },
  };
};

export default Dashboard;
