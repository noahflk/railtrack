import { useUser } from '@supabase/auth-helpers-react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { getLocaleProps } from '@/utils/locales';

const SignUp: NextPage = () => {
  const user = useUser();
  const router = useRouter();

  // work around in case logged in user state doesn't get captured by gSSP for social auth
  if (user?.role === 'authenticated') {
    router.push('/dashboard');
  }

  return (
    <AuthWrapper type="signup">
      <SignUpForm />
    </AuthWrapper>
  );
};

export const getServerSideProps = getLocaleProps;

export default SignUp;
