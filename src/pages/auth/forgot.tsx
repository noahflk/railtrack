import type { NextPage } from 'next';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { protectedAuthWithLocales } from '@/utils/protected';

const ForgotPassword: NextPage = () => (
  <AuthWrapper type="forgot">
    <ForgotPasswordForm />
  </AuthWrapper>
);

export const getServerSideProps = protectedAuthWithLocales;

export default ForgotPassword;
