import { useState } from 'react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { supabase } from '@/utils/supabase';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleForgot = async () => {
    // clear messages
    setSuccessMessage(undefined);
    setErrorMessage(undefined);
    setLoading(true);

    const { data, error } = await supabase.auth.api.resetPasswordForEmail(email);

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
          Email address
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
          {loading ? <LoadingSpinner /> : 'Reset password'}
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
