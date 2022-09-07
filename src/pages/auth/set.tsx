import type { GetServerSideProps, NextPage } from 'next';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { SetPasswordForm } from '@/components/auth/SetPasswordForm';
import { getLocaleProps } from '@/utils/locales';

const SetPassword: NextPage = () => {
  return (
    <AuthWrapper type="set">
      <SetPasswordForm />
    </AuthWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return getLocaleProps(ctx);
};

export default SetPassword;