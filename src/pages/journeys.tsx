import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';

import { JourneyList } from '@/components/journeys/JourneyList';
import { Wrapper } from '@/components/Wrapper';
import { getLocaleProps, useI18n } from '@/locales';
import { protectedRoute } from '@/utils/protected';

const Journeys: NextPage = () => {
  const { t } = useI18n();

  return (
    <Wrapper title={t('navigation.journeys')}>
      <JourneyList />
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = getLocaleProps((ctx: GetServerSidePropsContext) => {
  return protectedRoute(ctx);
});

export default Journeys;
