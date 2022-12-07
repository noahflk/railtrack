import router from 'next/router';
import { useTranslations } from 'next-intl';
import { LogoutIcon } from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import { useSessionContext, useUser } from '@supabase/auth-helpers-react';

export const SignoutButton: React.FC = () => {
  const { supabaseClient } = useSessionContext();
  const t = useTranslations('navigation');
  const user = useUser();

  return (
    <div className="space-y-2 px-2 py-2 text-base text-gray-600">
      {user && (
        <div>
          <p className="font-medium">{t('signedInAs')}: </p>
          <p className="block w-48 break-words font-light">{user.email}</p>
        </div>
      )}
      <button
        onClick={async () => {
          const { error } = await supabaseClient.auth.signOut();

          if (error) return toast.error(t('signOutError'));

          router.push('/signin');
        }}
        className="group flex w-full items-center rounded-md font-medium hover:bg-gray-50 hover:text-gray-900 focus:border-primary focus:outline-none focus:ring-primary"
      >
        <LogoutIcon className="mr-4 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
        {t('signOut')}
      </button>
    </div>
  );
};
