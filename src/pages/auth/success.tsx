import type { GetServerSideProps, NextPage } from 'next';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { getLocaleProps } from '@/utils/locales';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';

const Success: NextPage = () => {
  const user = supabaseClient.auth.user();

  const router = useRouter();

  if (user) {
    router.push('/dashboard?success=true');
  }

  return (
    <AuthWrapper type="verify">
      Check your email and click the link in the message to activate your account.
    </AuthWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return getLocaleProps(ctx);
};

export default Success;
