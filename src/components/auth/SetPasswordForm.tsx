import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export const SetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [hash, setHash] = useState('');
  const [successMessage, setSuccessMessage] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const t = useTranslations('auth');

  useEffect(() => {
    setHash(window.location.hash);
  }, []);

  const handleSubmit = async () => {
    // clear messages
    setSuccessMessage(undefined);
    setErrorMessage(undefined);
    setLoading(true);

    const hashArr = hash
      .substring(1)
      .split('&')
      .map((param) => param.split('='));

    let type;
    let accessToken;
    for (const [key, value] of hashArr) {
      if (key === 'type') {
        type = value;
      } else if (key === 'access_token') {
        accessToken = value;
      }
    }

    if (type !== 'recovery' || !accessToken || typeof accessToken === 'object') {
      toast.error('Invalid access token or type');
      return;
    }

    const { data, error } = await supabaseClient.auth.api.updateUser(accessToken, {
      password: password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (data) setSuccessMessage('Successfully set a new password. Please login.');
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
      method="POST"
      className="space-y-6"
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t('password')}
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="email"
            required
            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>

      {successMessage && <p className="text-sm text-green-600 ">{successMessage}</p>}
      {errorMessage && <p className="text-sm text-red-600 ">{errorMessage}</p>}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {loading ? <LoadingSpinner /> : t('set')}
        </button>
      </div>
    </form>
  );
};
