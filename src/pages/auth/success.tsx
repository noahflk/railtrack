import type { GetServerSideProps, NextPage } from 'next';
import { useTranslations } from 'next-intl';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { Link } from '@/components/Link';
import { protectedAuthWithLocales } from '@/utils/protectedLocales';

const Success: NextPage = () => {
  const t = useTranslations('auth');

  return (
    <AuthWrapper type="success">
      <Link href="/signin">{t('loginNow')}</Link>
    </AuthWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return protectedAuthWithLocales(ctx);
};

export default Success;
