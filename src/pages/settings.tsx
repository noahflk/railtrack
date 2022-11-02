import type { NextPage } from 'next';
import { useTranslations } from 'next-intl';

import { Account } from '@/components/settings/Account';
import { Support } from '@/components/settings/Support';
import { Wrapper } from '@/components/Wrapper';
import { getLocaleProps } from '@/utils/locales';

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

export const getServerSideProps = getLocaleProps;

export default Settings;
