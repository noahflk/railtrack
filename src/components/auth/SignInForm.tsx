import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { deleteCookie } from 'cookies-next';

import { Link } from '@/components/Link';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { LANG_COOKIE_KEY } from '@/constants';

export const SignInForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { supabaseClient } = useSessionContext();

  const t = useTranslations('auth');

  const handleSignIn = async () => {
    // clear error message
    setErrorMessage(undefined);
    setLoading(true);

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    // invalidate the stored language cookie
    // this will cause a DB re-fetch of the language preference on the next request
    deleteCookie(LANG_COOKIE_KEY);

    if (data) router.push('/dashboard');
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSignIn();
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
        <div className="flex justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            {t('password')}
          </label>
          <div className="text-sm">
            <Link href="/auth/forgot">{t('forgot')}</Link>
          </div>
        </div>
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
          {loading ? <LoadingSpinner /> : t('signIn')}
        </button>

        <GoogleButton type="signin" />
      </div>
    </form>
  );
};
