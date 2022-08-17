import type { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { SignInForm } from '@/components/auth/SignInForm';
import { protectedAuth } from '@/utils/protected';

const SignIn: NextPage = () => (
  <AuthWrapper type="signin">
    <SignInForm />
  </AuthWrapper>
);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    ...(await protectedAuth(ctx)),
    props: {
      ...(await serverSideTranslations(ctx.locale ?? '', ['common', 'auth'])),
    },
  };
};

export default SignIn;
