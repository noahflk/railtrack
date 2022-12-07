import { useTranslations } from 'next-intl';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useState } from 'react';

import { LoadingSpinner } from '@/components/LoadingSpinner';

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const { supabaseClient } = useSessionContext();

  const t = useTranslations('auth');

  const handleForgot = async () => {
    // clear messages
    setSuccessMessage(undefined);
    setErrorMessage(undefined);
    setLoading(true);

    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: process.env.NEXT_PUBLIC_APP_URL + '/auth/set',
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (data) setSuccessMessage('Password reset email sent');
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleForgot();
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

      {successMessage && <p className="text-sm text-green-600 ">{successMessage}</p>}
      {errorMessage && <p className="text-sm text-red-600 ">{errorMessage}</p>}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {loading ? <LoadingSpinner /> : t('reset')}
        </button>
      </div>
    </form>
  );
};
