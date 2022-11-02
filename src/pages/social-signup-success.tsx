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
      // we do this on client because we don't yet have the access token on server
      // send request to server to notify for new google login
      mutation.mutate();

      router.push('/dashboard');
    }
  }, [user, router, mutation]);

  return null;
};

export default SocialSignupSuccess;
