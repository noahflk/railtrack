import { ChartBarIcon, ClockIcon, GlobeIcon } from '@heroicons/react/outline';
import { useTranslations } from 'next-intl';

import { Stat } from '@/components/Stat';
import { type RouterOutputs } from '@/utils/trpc';

type Props = {
  type: 'dashboard' | 'journeyDetail';
  // doesn't matter if we take a single stat or all stats, they have the same type
  stats: RouterOutputs['stats']['getPeriod'] | undefined;
};

type DurationDisplayProps = {
  duration?: number;
  type: 'minutes' | 'hours';
};

const DurationDisplay: React.FC<DurationDisplayProps> = ({ duration, type = 'hours' }) => {
  const t = useTranslations();

  return (
    <Stat title={t('time')} icon={<ClockIcon className="h-14 w-14 flex-shrink-0 sm:hidden xl:inline" />}>
      <p className="mt-2 truncate text-3xl font-medium">
        {duration ?? '...'} <span className="text-xl text-gray-500">{t(type, { count: duration })}</span>
      </p>
    </Stat>
  );
};

export const StatsDisplay: React.FC<Props> = ({ type, stats }) => {
  const t = useTranslations(type);

  return (
    <ul role="list" className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Stat title={t('distance')} icon={<GlobeIcon className="h-14 w-14 flex-shrink-0 sm:hidden xl:inline" />}>
        <p className="mt-2 truncate text-3xl font-medium">
          {stats ? stats.distance : '...'} <span className="text-xl text-gray-500">km</span>
        </p>
      </Stat>
      <DurationDisplay duration={stats?.duration} type={type === 'dashboard' ? 'hours' : 'minutes'} />
      <Stat title={t('total')} icon={<ChartBarIcon className="h-14 w-14 flex-shrink-0 sm:hidden xl:inline" />}>
        <p className="mt-2 truncate text-3xl font-medium">{stats ? stats.count : '...'}</p>
      </Stat>
    </ul>
  );
};
