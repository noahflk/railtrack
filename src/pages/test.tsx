import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextPage } from 'next';

const SignIn: NextPage = () => {
  const user = supabaseClient.auth.user();
  console.log(user, 'balbla');

  return <p>hi</p>;
};

export default SignIn;
