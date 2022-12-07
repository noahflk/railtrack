import { useTranslations } from 'next-intl';
import { useSessionContext } from '@supabase/auth-helpers-react';

import { GoogleIcon } from '@/components/Icons';

type Props = {
  type: 'signin' | 'signup';
};

export const GoogleButton: React.FC<Props> = ({ type }) => {
  const { supabaseClient } = useSessionContext();

  const t = useTranslations('auth');

  const handleGoogleSignUp = async () => {
    await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  return (
    <button
      className="border-1 flex w-full justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      type="button"
      onClick={handleGoogleSignUp}
    >
      <div className="flex gap-2">
        <GoogleIcon className="w-4" />
        {t(type === 'signup' ? 'signUpGoogle' : 'signInGoogle')}
      </div>
    </button>
  );
};
