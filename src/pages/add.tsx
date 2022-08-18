import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';

import { JourneySearchForm } from '@/components/add-journey/JourneySearchForm';
import { JourneySearchResults } from '@/components/add-journey/JourneySearchResults';
import { Wrapper } from '@/components/Wrapper';
import { protectedRoute } from '@/utils/protected';
import { getLocaleProps, useI18n } from '@/locales';

const Add: NextPage = () => {
  const { t } = useI18n();

  return (
    <Wrapper title={t('navigation.addJourney')}>
      <ul role="list" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <JourneySearchForm />
        <JourneySearchResults />
      </ul>
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = getLocaleProps((ctx: GetServerSidePropsContext) => {
  return protectedRoute(ctx);
});

export default Add;
