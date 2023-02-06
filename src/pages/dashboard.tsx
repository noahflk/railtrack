import type { NextPage } from 'next';
import { useTranslations } from 'next-intl';

import { JourneyMap } from '@/components/dashboard/JourneyMap';
import { RecentJourneys } from '@/components/dashboard/RecentJourneys';
import { Wrapper } from '@/components/Wrapper';
import { getLocaleProps } from '@/utils/locales';
import { StatsDisplay } from '@/components/StatsDisplay';
import { trpc } from '@/utils/trpc';

const Dashboard: NextPage = () => {
  const t = useTranslations();

  const { data: stats } = trpc.journey.stats.useQuery();

  return (
    <Wrapper title={t('navigation.dashboard')}>
      <StatsDisplay type="dashboard" stats={stats} />
      <div className="mt-4 grid grid-cols-1 gap-y-6 xl:grid-cols-3 xl:gap-6">
        <RecentJourneys />
        <JourneyMap />
      </div>
    </Wrapper>
  );
};

export const getServerSideProps = getLocaleProps;

export default Dashboard;
