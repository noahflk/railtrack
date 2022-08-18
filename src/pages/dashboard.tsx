import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';

import { JourneyMap } from '@/components/dashboard/JourneyMap';
import { RecentJourneys } from '@/components/dashboard/RecentJourneys';
import { StatsDisplay } from '@/components/dashboard/StatsDisplay';
import { Wrapper } from '@/components/Wrapper';
import { getLocaleProps, useI18n } from '@/locales';
import { protectedRoute } from '@/utils/protected';

const Dashboard: NextPage = () => {
  const { t } = useI18n();

  return (
    <Wrapper title={t('navigation.dashboard')}>
      <StatsDisplay />
      <div className="grid grid-cols-1 gap-6 mt-4 xl:grid-cols-3">
        <RecentJourneys />
        <JourneyMap />
      </div>
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = getLocaleProps((ctx: GetServerSidePropsContext) => {
  return protectedRoute(ctx);
});

export default Dashboard;
