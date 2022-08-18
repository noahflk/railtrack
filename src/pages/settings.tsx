import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';

import { Account } from '@/components/settings/Account';
import { Wrapper } from '@/components/Wrapper';
import { protectedRouteWithLocales } from '@/utils/protectedLocales';
import { useTranslations } from 'next-intl';

const Settings: NextPage = () => {
  const t = useTranslations();

  return (
    <Wrapper title={t('navigation.addJourney')}>
      <Account />
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return protectedRouteWithLocales(ctx);
};

export default Settings;
