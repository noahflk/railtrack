import { useSessionContext } from '@supabase/auth-helpers-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { deleteCookie } from 'cookies-next';
import { useState } from 'react';

import { GoogleButton } from '@/components/auth/GoogleButton';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { LANG_COOKIE_KEY } from '@/constants';

export const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const { supabaseClient } = useSessionContext();

  const t = useTranslations('auth');

  const router = useRouter();

  const handleSignUp = async () => {
    // clear error message
    setErrorMessage(undefined);
    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_APP_URL + '/auth/success',
      },
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    // invalidate the stored language cookie
    // this will cause a DB re-fetch of the language preference on the next request
    deleteCookie(LANG_COOKIE_KEY);

    // if there is a session it means that we do not need to verify the email beforehand
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/auth/verify');
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSignUp();
      }}
      method="POST"
      className="space-y-6"
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t('email')}
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {t('password')}
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
          />
        </div>
      </div>

      {errorMessage && <p className="text-sm text-red-600 ">{errorMessage}</p>}

      <div className="space-y-4">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {loading ? <LoadingSpinner /> : t('signUp')}
        </button>

        <GoogleButton type="signup" />
      </div>
    </form>
  );
};
