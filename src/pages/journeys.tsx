import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { useTranslations } from 'next-intl';

import { JourneyList } from '@/components/journeys/JourneyList';
import { Wrapper } from '@/components/Wrapper';
import { getLocaleProps } from '@/locales';
import { protectedRouteWithLocales } from '@/utils/protectedLocales';

const Journeys: NextPage = () => {
  const t = useTranslations();

  return (
    <Wrapper title={t('navigation.journeys')}>
      <JourneyList />
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = getLocaleProps((ctx: GetServerSidePropsContext) => {
  return protectedRouteWithLocales(ctx);
});

export default Journeys;
