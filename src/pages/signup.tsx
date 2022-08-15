import type { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { protectedAuth } from '@/utils/protected';

const SignUp: NextPage = () => (
  <AuthWrapper type="signup">
    <SignUpForm />
  </AuthWrapper>
);

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  return {
    ...(await protectedAuth(req)),
    props: {
      ...(await serverSideTranslations(locale ?? '', ['common', 'auth'])),
    },
  };
};

export default SignUp;
