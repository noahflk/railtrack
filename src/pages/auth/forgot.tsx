import type { NextPage } from 'next';

import AuthWrapper from '@/components/auth/AuthWrapper';
import { protectedAuth } from '@/utils/protectedRoute';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

const ForgotPassword: NextPage = () => {
  return (
    <AuthWrapper type="forgot">
      <ForgotPasswordForm />
    </AuthWrapper>
  );
};

export async function getServerSideProps({ req }) {
  return protectedAuth(req);
}

export default ForgotPassword;
