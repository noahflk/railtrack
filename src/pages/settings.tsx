import type { GetServerSideProps, NextPage } from 'next';
import { useTranslations } from 'next-intl';

import { Account } from '@/components/settings/Account';
import { Support } from '@/components/settings/Support';
import { Wrapper } from '@/components/Wrapper';
import { protectedRouteWithLocales } from '@/utils/protectedLocales';

const Settings: NextPage = () => {
  const t = useTranslations();

  return (
    <Wrapper title={t('navigation.addJourney')}>
      <div className="space-y-6">
        <Account />
        <Support />
      </div>
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return protectedRouteWithLocales(ctx);
};

export default Settings;
