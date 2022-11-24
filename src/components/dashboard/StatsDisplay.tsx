import { ChartBarIcon, ClockIcon, GlobeIcon } from '@heroicons/react/outline';
import { useTranslations } from 'next-intl';

import { Stat } from '@/components/dashboard/Stat';
import { trpc } from '@/utils/trpc';

export const StatsDisplay: React.FC = () => {
  const { data: stats } = trpc.journey.stats.useQuery();

  const t = useTranslations('dashboard');

  return (
    <ul role="list" className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Stat title={t('distance')} icon={<GlobeIcon className="flex-shrink-0 w-14 h-14 sm:hidden xl:inline" />}>
        <p className="mt-2 text-3xl font-medium truncate">
          {stats ? stats.distance : '...'} <span className="text-xl text-gray-500">km</span>
        </p>
      </Stat>
      <Stat title={t('time')} icon={<ClockIcon className="flex-shrink-0 w-14 h-14 sm:hidden xl:inline" />}>
        <p className="mt-2 text-3xl font-medium truncate">
          {stats ? stats.duration : '...'}{' '}
          <span className="text-xl text-gray-500">{t(stats?.duration === 1 ? 'hour_one' : 'hour_other')}</span>
        </p>
      </Stat>
      <Stat title={t('total')} icon={<ChartBarIcon className="flex-shrink-0 w-14 h-14 sm:hidden xl:inline" />}>
        <p className="mt-2 text-3xl font-medium truncate">{stats ? stats.count : '...'}</p>
      </Stat>
    </ul>
  );
};
