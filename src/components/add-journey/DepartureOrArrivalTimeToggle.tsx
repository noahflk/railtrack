import { Switch } from '@headlessui/react';
import { useTranslations } from 'next-intl';

import { classNames } from '@/utils/styling';

type Props = {
  isArrival: boolean;
  setIsArrival: (isArrival: boolean) => void;
  className?: string;
};

export const DepartureOrArrivalTimeToggle: React.FC<Props> = ({ className, isArrival, setIsArrival }) => {
  const t = useTranslations('add.abbreviation');

  const enabled = isArrival;

  return (
    <div className={classNames('flex h-full items-center gap-2', className)}>
      <label className="block text-sm font-medium text-gray-700">{t('dep')}</label>
      <Switch
        checked={enabled}
        onChange={setIsArrival}
        className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
      <label className="block text-sm font-medium text-gray-700">{t('arr')}</label>
    </div>
  );
};
