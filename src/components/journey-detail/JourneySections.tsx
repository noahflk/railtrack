import { ArrowNarrowRightIcon, ExclamationIcon } from '@heroicons/react/outline';
import { Section } from '@prisma/client';
import { formatInTimeZone } from 'date-fns-tz';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import { APP_TIMEZONE } from '@/constants';
import { trpc } from '@/utils/trpc';

const RecentJourneysWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = useTranslations('journeyDetail');

  return (
    <div className="col-span-1 rounded-lg bg-white p-4 shadow">
      <h3 className="text-xl font-medium text-gray-900">{t('sections')}</h3>
      {children}
    </div>
  );
};

type Props = {
  section: Section;
};

const Section: React.FC<Props> = ({ section }) => (
  <li className="flex items-center justify-between py-1">
    <p>
      <span className="font-medium">{formatInTimeZone(section.departureTime, APP_TIMEZONE, 'hh:mm')} - </span>
      <span>{section.departureStation}</span> <ArrowNarrowRightIcon className="inline w-6 text-primary" />{' '}
      <span>{section.arrivalStation}</span>
    </p>
  </li>
);

export const FailedNotice: React.FC = () => {
  const t = useTranslations('journeyDetail');

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-2 pb-8">
      <ExclamationIcon className="w-20 " />
      <p className="text-lg font-medium">{t('unableToLoadJourney')}</p>
    </div>
  );
};

export const JourneySections: React.FC = () => {
  const router = useRouter();

  const journeyId = typeof router.query.journey === 'string' ? router.query.journey : undefined;

  const { data: journey, isLoading } = trpc.journey.getOne.useQuery(journeyId ?? '');

  if (isLoading) {
    return (
      <RecentJourneysWrapper>
        <div className="w-full animate-pulse space-y-4 pt-4 ">
          <div className="h-6 rounded-md bg-gray-300 "></div>
          <div className="h-6 rounded-md bg-gray-300 "></div>
          <div className="h-6 rounded-md bg-gray-300 "></div>
        </div>
      </RecentJourneysWrapper>
    );
  }

  if (!journey) {
    return (
      <RecentJourneysWrapper>
        <FailedNotice />
      </RecentJourneysWrapper>
    );
  }

  return (
    <RecentJourneysWrapper>
      <div className="flex h-full flex-col justify-between pb-5">
        <ul>
          {journey.sections.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </ul>
      </div>
    </RecentJourneysWrapper>
  );
};
