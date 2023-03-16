import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

import { Period } from '@/types/period';
import type { RouterOutputs } from '@/utils/trpc';

type Props = {
  data: RouterOutputs['charts']['getPeriodCharts']['journeyCount'];
  period: Period;
};

const getVersion = (period: Period) => {
  if (['week', 'month'].includes(period)) {
    return 'day';
  }

  return 'month';
};

const formatLabel = (label: string, period: Period) => {
  const version = getVersion(period);

  const labelDate = new Date(label);
  if (version === 'month') {
    return format(labelDate, 'MMM');
  }

  return format(labelDate, 'd');
};

export const JourneyCountChart: React.FC<Props> = ({ data, period }) => {
  const t = useTranslations('stats');

  const version = getVersion(period);

  const formattedData = data.map((item) => ({
    ...item,
    label: formatLabel(item.label, period),
  }));

  return (
    <div className="rounded-lg bg-white p-4 shadow ">
      <p className="pb-8 text-xl font-medium">
        {t('journeysPer')} {t(`${version}_lower`)}
      </p>
      <ResponsiveContainer height={300} width="100%">
        <BarChart width={730} height={250} data={formattedData}>
          <XAxis dataKey="label" />
          <Tooltip />
          <Bar dataKey="value" fill="#902D41" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
