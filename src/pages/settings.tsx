import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';

import { Wrapper } from '@/components/Wrapper';
import { protectedRoute } from '@/utils/protected';
import { Account } from '@/components/settings/Account';
import { getLocaleProps, useI18n } from '@/locales';

const Settings: NextPage = () => {
  const { t } = useI18n();

  return (
    <Wrapper title={t('navigation.addJourney')}>
      <Account />
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = getLocaleProps((ctx: GetServerSidePropsContext) => {
  return protectedRoute(ctx);
});

export default Settings;
