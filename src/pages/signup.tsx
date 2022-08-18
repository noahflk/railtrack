import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { protectedAuth } from '@/utils/protected';
import { getLocaleProps } from '@/locales';

const SignUp: NextPage = () => (
  <AuthWrapper type="signup">
    <SignUpForm />
  </AuthWrapper>
);

export const getServerSideProps: GetServerSideProps = getLocaleProps((ctx: GetServerSidePropsContext) => {
  return protectedAuth(ctx);
});

export default SignUp;
