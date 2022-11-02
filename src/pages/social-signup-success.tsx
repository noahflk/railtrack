import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { trpc } from '@/utils/trpc';

const SocialSignupSuccess: NextPage = () => {
  const router = useRouter();
  const mutation = trpc.useMutation('log.potential-google-signup');

  // we do this on client because we don't yet have the access token on server
  // send request to server to notify for new google login
  mutation.mutate();

  // immediately redirect to dashboard
  router.push('/dashboard');

  return null;
};

export default SocialSignupSuccess;
