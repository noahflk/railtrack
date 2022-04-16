import { useState } from 'react';
import type { NextPage } from 'next';

import { supabase } from '@/utils/supabaseClient';
import AuthWrapper from '@/components/auth/AuthWrapper';
import { protectedAuth } from '@/utils/protectedRoute';

const ForgotPassword: NextPage = () => {
  const [email, setEmail] = useState('');

  const handleForgot = async () => {
    await supabase.auth.api.resetPasswordForEmail(email);
  };

  return (
    <AuthWrapper type="forgot">
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

        <div>
          <button
            type="submit"
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset password
          </button>
        </div>
      </form>
    </AuthWrapper>
  );
};

export async function getServerSideProps({ req }) {
  return protectedAuth(req);
}

export default ForgotPassword;
