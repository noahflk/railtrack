import type { GetServerSideProps, NextPage } from 'next';
import { useTranslations } from 'next-intl';

import { JourneyMap } from '@/components/dashboard/JourneyMap';
import { RecentJourneys } from '@/components/dashboard/RecentJourneys';
import { StatsDisplay } from '@/components/dashboard/StatsDisplay';
import { Wrapper } from '@/components/Wrapper';
import { protectedRouteWithLocales } from '@/utils/protectedLocales';

const Dashboard: NextPage = () => {
  const t = useTranslations();

  return (
    <Wrapper title={t('navigation.dashboard')}>
      <StatsDisplay />
      <div className="grid grid-cols-1 gap-y-6 xl:gap-6 mt-4 xl:grid-cols-3">
        <RecentJourneys />
        <JourneyMap />
      </div>
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return protectedRouteWithLocales(ctx);
};

export default Dashboard;
