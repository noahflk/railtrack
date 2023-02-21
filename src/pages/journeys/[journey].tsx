import type { NextPage } from 'next';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

import { Map } from '@/components/journey-detail/Map';
import { JourneySections } from '@/components/journey-detail/JourneySections';
import { Wrapper } from '@/components/Wrapper';
import { getLocaleProps } from '@/utils/locales';
import { trpc } from '@/utils/trpc';
import { JourneyDetailHeader } from '@/components/journey-detail/JourneyDetailHeader';
import { StatsDisplay } from '@/components/StatsDisplay';

const JourneyDetail: NextPage = () => {
  const router = useRouter();
  const t = useTranslations();

  const journeyId = typeof router.query.journey === 'string' ? router.query.journey : undefined;

  const { data: stats } = trpc.stats.getOne.useQuery(journeyId ?? '', { retry: false });

  trpc.journey.getOne.useQuery(journeyId ?? '', {
    retry: false,
    onError: () => {
      toast.error(t('journeyDetail.unableToLoadJourney', { duration: 10_000 }));
    },
  });

  return (
    <Wrapper title={t('navigation.journeys')}>
      <JourneyDetailHeader />
      <StatsDisplay type="journeyDetail" stats={stats} />
      <div className="mt-4 grid grid-cols-1 gap-y-6 xl:grid-cols-3 xl:gap-6">
        <JourneySections />
        <div className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow lg:col-span-2">
          <Map id={journeyId ?? ''} />
        </div>
      </div>
    </Wrapper>
  );
};

export const getServerSideProps = getLocaleProps;

export default JourneyDetail;
