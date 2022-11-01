import { useUser } from '@supabase/auth-helpers-react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { SignInForm } from '@/components/auth/SignInForm';
import { getLocaleProps } from '@/utils/locales';

const SignIn: NextPage = () => {
  const user = useUser();
  const router = useRouter();

  // work around in case logged in user state doesn't get captured by gSSP for social auth
  if (user?.role === 'authenticated') {
    router.push('/dashboard');
  }

  return (
    <AuthWrapper type="signin">
      <SignInForm />
    </AuthWrapper>
  );
};

export const getServerSideProps = getLocaleProps;

export default SignIn;
