import type { NextPage } from 'next';
import { useTranslations } from 'next-intl';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { Link } from '@/components/Link';
import { getLocaleProps } from '@/utils/locales';

const Success: NextPage = () => {
  const t = useTranslations('auth');

  return (
    <AuthWrapper type="success">
      <Link href="/signin">{t('loginNow')}</Link>
    </AuthWrapper>
  );
};

export const getServerSideProps = getLocaleProps;

export default Success;
