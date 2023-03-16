import type { NextPage } from 'next';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { PeriodSelect } from '@/components/stats/PeriodSelect';
import { Wrapper } from '@/components/Wrapper';
import type { Period } from '@/types/period';
import { getLocaleProps } from '@/utils/locales';
import { trpc } from '@/utils/trpc';
import { StatsDisplay } from '@/components/StatsDisplay';

const Stats: NextPage = () => {
  const [period, setPeriod] = useState<Period>('week');

  const { data: stats } = trpc.stats.getPeriod.useQuery(period);

  const t = useTranslations();

  return (
    <Wrapper title={t('navigation.stats')}>
      <div className="space-y-6">
        <PeriodSelect period={period} setPeriod={setPeriod} />
        <StatsDisplay stats={stats} type="dashboard" />
      </div>
    </Wrapper>
  );
};

export const getServerSideProps = getLocaleProps;

export default Stats;
