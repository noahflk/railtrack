import { classNames } from '@/utils/styling';
import { useTranslations } from 'next-intl';

import Switch from 'react-switch';

type Props = {
  isArrival: boolean;
  setIsArrival: (isArrival: boolean) => void;
  className?: string;
};

export const FlightTimeToggle: React.FC<Props> = ({ className, isArrival, setIsArrival }) => {
  const t = useTranslations('add.abbreviation');

  return (
    <div className={classNames('flex h-full items-center gap-2', className)}>
      <label className="block text-sm font-medium text-gray-700">{t('dep')}</label>
      <Switch
        onChange={() => setIsArrival(!isArrival)}
        checked={isArrival}
        checkedIcon={false}
        uncheckedIcon={false}
        onColor="#902D41"
        offColor="#10B981"
      />
      <label className="block text-sm font-medium text-gray-700">{t('arr')}</label>
    </div>
  );
};
