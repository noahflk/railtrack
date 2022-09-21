import { useTranslations } from 'next-intl';

import { GoogleIcon } from '@/components/Icons';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';

type Props = {
  type: 'signin' | 'signup';
};

export const GoogleButton: React.FC<Props> = ({ type }) => {
  const t = useTranslations('auth');

  const handleGoogleSignUp = async () => {
    await supabaseClient.auth.signIn({
      provider: 'google',
      redirectTo: '/test',
    });
  };

  return (
    <button
      className="flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 border-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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
