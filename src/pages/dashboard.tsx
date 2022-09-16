import type { GetServerSideProps, NextPage } from 'next';
import { useTranslations } from 'next-intl';

import { JourneyMap } from '@/components/dashboard/JourneyMap';
import { RecentJourneys } from '@/components/dashboard/RecentJourneys';
import { StatsDisplay } from '@/components/dashboard/StatsDisplay';
import { Wrapper } from '@/components/Wrapper';
import { protectedRouteWithLocales } from '@/utils/protectedLocales';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const Dashboard: NextPage = () => {
  const router = useRouter();

  const t = useTranslations();

  const { success } = router.query;

  if (success) {
    toast.success('Your email is now verified');
  }

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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return protectedRouteWithLocales(ctx);
};

export default Dashboard;
