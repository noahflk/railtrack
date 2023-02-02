import type { NextPage } from 'next';
import { useTranslations } from 'next-intl';

import { Wrapper } from '@/components/Wrapper';
import { getLocaleProps } from '@/utils/locales';
import { JourneyDetailView } from '@/components/journey-detail/JourneyDetailView';

const JourneyDetail: NextPage = () => {
  const t = useTranslations();

  return (
    <Wrapper title={t('navigation.journeys')}>
      <JourneyDetailView />
    </Wrapper>
  );
};

export const getServerSideProps = getLocaleProps;

export default JourneyDetail;
