import type { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { Wrapper } from '@/components/Wrapper';
import { JourneySearchForm } from '@/components/add-journey/JourneySearchForm';
import { JourneySearchResults } from '@/components/add-journey/JourneySearchResults';
import { protectedRoute } from '@/utils/protected';

const Add: NextPage = () => {
  const { t } = useTranslation('common');

  return (
    <Wrapper title={t('addJourney')}>
      <ul role="list" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <JourneySearchForm />
        <JourneySearchResults />
      </ul>
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    ...(await protectedRoute(ctx)),
    props: {
      ...(await serverSideTranslations(ctx.locale ?? '', ['common', 'add-journey'])),
    },
  };
};

export default Add;
