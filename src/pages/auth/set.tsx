import type { GetServerSideProps, NextPage } from 'next';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { getLocaleProps } from '@/utils/locales';

const SetPassword: NextPage = () => {
  return (
    <AuthWrapper type="set">
      <ForgotPasswordForm />
    </AuthWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return getLocaleProps(ctx);
};

export default SetPassword;
