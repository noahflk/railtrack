import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { SignInForm } from '@/components/auth/SignInForm';
import { getLocaleProps } from '@/locales';
import { protectedAuth } from '@/utils/protected';

const SignIn: NextPage = () => (
  <AuthWrapper type="signin">
    <SignInForm />
  </AuthWrapper>
);

export const getServerSideProps: GetServerSideProps = getLocaleProps((ctx: GetServerSidePropsContext) => {
  return protectedAuth(ctx);
});

export default SignIn;
