import { useUser } from '@supabase/auth-helpers-react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { trpc } from '@/utils/trpc';
import { useEffect } from 'react';

const SocialSignupSuccess: NextPage = () => {
  const router = useRouter();
  const user = useUser();
  const mutation = trpc.useMutation('log.potential-google-signup');

  useEffect(() => {
    if (user) {
      mutation.mutate();

      router.push('/dashboard');
    }
  }, [user, router]);

  return <p>Welcome here</p>;
};

export default SocialSignupSuccess;
