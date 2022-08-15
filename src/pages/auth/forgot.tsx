import type { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { protectedAuth } from '@/utils/protected';

const ForgotPassword: NextPage = () => {
  return (
    <AuthWrapper type="forgot">
      <ForgotPasswordForm />
    </AuthWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  return {
    ...(await protectedAuth(req)),
    props: {
      ...(await serverSideTranslations(locale ?? '', ['common', 'auth'])),
    },
  };
};

export default ForgotPassword;
