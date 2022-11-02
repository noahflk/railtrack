import type { NextPage } from 'next';
import { useUser } from '@supabase/auth-helpers-react';

const SocialSignupSuccess: NextPage = () => {
  const user = useUser();

  console.log(user, 'useeeer');

  return <p>Nice to meet you!</p>;
};

export default SocialSignupSuccess;
