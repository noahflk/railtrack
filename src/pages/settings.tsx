import type { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Wrapper } from '@/components/Wrapper';
import { protectedRoute } from '@/utils/protected';

const Settings: NextPage = () => {
  const { t } = useTranslation('common');

  return <Wrapper title={t('addJourney')}>Settings</Wrapper>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    ...(await protectedRoute(ctx)),
    props: {
      ...(await serverSideTranslations(ctx.locale ?? '', ['common'])),
    },
  };
};

export default Settings;
