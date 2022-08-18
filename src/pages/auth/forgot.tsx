import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { getLocaleProps } from '@/locales';
import { protectedAuth } from '@/utils/protected';

const ForgotPassword: NextPage = () => {
  return (
    <AuthWrapper type="forgot">
      <ForgotPasswordForm />
    </AuthWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = getLocaleProps((ctx: GetServerSidePropsContext) => {
  return protectedAuth(ctx);
});

export default ForgotPassword;
