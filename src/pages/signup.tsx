import type { NextPage } from 'next';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { protectedAuth } from '@/utils/protected';

const SignUp: NextPage = () => (
  <AuthWrapper type="signup">
    <SignUpForm />
  </AuthWrapper>
);

export async function getServerSideProps({ req }) {
  return protectedAuth(req);
}

export default SignUp;
