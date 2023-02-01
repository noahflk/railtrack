import type { NextPage } from 'next';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { SetPasswordForm } from '@/components/auth/SetPasswordForm';
import { getLocaleProps } from '@/utils/locales';

const SetPassword: NextPage = () => (
  <AuthWrapper type="set">
    <SetPasswordForm />
  </AuthWrapper>
);

export const getServerSideProps = getLocaleProps;

export default SetPassword;
