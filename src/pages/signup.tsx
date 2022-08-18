import type { GetServerSideProps, NextPage } from 'next';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { protectedAuthWithLocales } from '@/utils/protectedLocales';

const SignUp: NextPage = () => (
  <AuthWrapper type="signup">
    <SignUpForm />
  </AuthWrapper>
);

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return protectedAuthWithLocales(ctx);
};

export default SignUp;
