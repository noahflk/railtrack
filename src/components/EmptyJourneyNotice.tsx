import { DocumentSearchIcon } from '@heroicons/react/outline';
import { useTranslations } from 'next-intl';

import { Link } from '@/components//Link';

export const EmptyJourneyNotice: React.FC = () => {
  const t = useTranslations();

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-2 pb-8">
      <DocumentSearchIcon className="w-20 " />
      <p className="text-lg font-medium">{t('emptyJourneys')}</p>
      <Link href="/add">{t('addJourney')}</Link>
    </div>
  );
};
