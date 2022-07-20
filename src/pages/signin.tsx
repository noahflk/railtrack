import type { NextPage } from 'next';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { SignInForm } from '@/components/auth/SignInForm';
import { protectedAuth } from '@/utils/protected';

export const SignIn: NextPage = () => (
  <AuthWrapper type="signin">
    <SignInForm />
  </AuthWrapper>
);

export async function getServerSideProps({ req }) {
  return protectedAuth(req);
}
