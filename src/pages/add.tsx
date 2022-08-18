import type { GetServerSideProps, NextPage } from 'next';
import { useTranslations } from 'next-intl';

import { JourneySearchForm } from '@/components/add-journey/JourneySearchForm';
import { JourneySearchResults } from '@/components/add-journey/JourneySearchResults';
import { Wrapper } from '@/components/Wrapper';
import { protectedRouteWithLocales } from '@/utils/protectedLocales';

const Add: NextPage = () => {
  const t = useTranslations();

  return (
    <Wrapper title={t('navigation.addJourney')}>
      <ul role="list" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <JourneySearchForm />
        <JourneySearchResults />
      </ul>
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return protectedRouteWithLocales(ctx);
};

export default Add;
