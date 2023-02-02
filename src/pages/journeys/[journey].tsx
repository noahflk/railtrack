import type { NextPage } from 'next';
import { useTranslations } from 'next-intl';

import { Wrapper } from '@/components/Wrapper';
import { getLocaleProps } from '@/utils/locales';
import { JourneyDetailView } from '@/components/journey-detail/JourneyDetailView';
import { Map } from '@/components/journey-detail/Map';
import { RecentJourneys } from '@/components/dashboard/RecentJourneys';
import { useRouter } from 'next/router';

const JourneyDetail: NextPage = () => {
  const router = useRouter();
  const t = useTranslations();

  const { journey: journeyId } = router.query;

  return (
    <Wrapper title={t('navigation.journeys')}>
      <JourneyDetailView />
      <div className="mt-4 grid grid-cols-1 gap-y-6 xl:grid-cols-3 xl:gap-6">
        <RecentJourneys />
        <div className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow lg:col-span-2">
          <Map id={Number(journeyId)} />
        </div>
      </div>
    </Wrapper>
  );
};

export const getServerSideProps = getLocaleProps;

export default JourneyDetail;
