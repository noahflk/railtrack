import router from 'next/router';
import { useTranslations } from 'next-intl';
import { LogoutIcon } from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import { useSessionContext } from '@supabase/auth-helpers-react';

export const SignoutButton: React.FC = () => {
  const { supabaseClient } = useSessionContext();
  const t = useTranslations('navigation');

  return (
    <button
      onClick={async () => {
        const { error } = await supabaseClient.auth.signOut();

        if (error) return toast.error(t('signOutError'));

        router.push('/signin');
      }}
      className="flex items-center w-full px-2 py-2 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group focus:outline-none focus:ring-primary focus:border-primary"
    >
      <LogoutIcon className="flex-shrink-0 w-6 h-6 mr-4 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
      {t('signOut')}
    </button>
  );
};
