import { useTranslations } from 'next-intl';

import { EmptyJourneyNotice } from '@/components/EmptyJourneyNotice';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import { Section } from '@prisma/client';
import { APP_TIMEZONE } from '@/constants';
import { formatInTimeZone } from 'date-fns-tz';
import { ArrowNarrowRightIcon } from '@heroicons/react/outline';

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

export const Sections: React.FC = () => {
  const router = useRouter();

  const { journey: journeyId } = router.query;

  const { data: journey } = trpc.journey.getOne.useQuery(Number(journeyId) ?? 0);

  if (!journey)
    return (
      <RecentJourneysWrapper>
        <div className="w-full animate-pulse space-y-4 pt-4 ">
          <div className="h-6 rounded-md bg-gray-300 "></div>
          <div className="h-6 rounded-md bg-gray-300 "></div>
          <div className="h-6 rounded-md bg-gray-300 "></div>
        </div>
      </RecentJourneysWrapper>
    );

  if (journey.sections.length === 0)
    return (
      <RecentJourneysWrapper>
        <EmptyJourneyNotice />
      </RecentJourneysWrapper>
    );

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
