import type { GetServerSideProps, NextPage } from 'next';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { SignInForm } from '@/components/auth/SignInForm';
import { protectedAuthWithLocales } from '@/utils/protectedLocales';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';

const SignIn: NextPage = () => {
  const user = supabaseClient.auth.user();
  console.log(user, 'balbla');

  return (
    <AuthWrapper type="signin">
      <SignInForm />
    </AuthWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return protectedAuthWithLocales(ctx);
};

export default SignIn;
