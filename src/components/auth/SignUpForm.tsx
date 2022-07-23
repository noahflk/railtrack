import { useState } from 'react';
import { useRouter } from 'next/router';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { supabase } from '@/utils/supabase';

export const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    // clear error message
    setErrorMessage(undefined);
    setLoading(true);

    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log('success signup???', user, error);

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (user) router.push('/dashboard');
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

      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
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
            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>

      {errorMessage && <p className="text-sm text-red-600 ">{errorMessage}</p>}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {loading ? <LoadingSpinner /> : 'Sign Up'}
        </button>
      </div>
    </form>
  );
};
