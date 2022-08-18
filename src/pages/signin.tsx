import type { GetServerSideProps, NextPage } from 'next';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { SignInForm } from '@/components/auth/SignInForm';
import { protectedAuthWithLocales } from '@/utils/protectedLocales';

const SignIn: NextPage = () => (
  <AuthWrapper type="signin">
    <SignInForm />
  </AuthWrapper>
);

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return protectedAuthWithLocales(ctx);
};

export default SignIn;
