import { useTranslations } from 'next-intl';

import type { Period } from '@/types/period';
import { trpc } from '@/utils/trpc';

type Props = {
  period: Period;
  setPeriod: (period: Period) => void;
};

export const PeriodSelect: React.FC<Props> = ({ period, setPeriod }) => {
  const t = useTranslations('stats');

  const { data: avilableYears } = trpc.stats.getYearsWithData.useQuery();

  return (
    <div>
      <label htmlFor="period" className="sr-only block text-sm font-medium leading-6 text-gray-900">
        {t('period')}
      </label>
      <select
        id="period"
        name="period"
        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
        value={period}
        onChange={(e) => setPeriod(e.target.value as Period)}
      >
        <option value="week">{t('week')}</option>
        <option value="month">{t('month')}</option>
        <option value="year">{t('year')}</option>
        <option value="all">{t('all')}</option>
        {avilableYears?.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};
