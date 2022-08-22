import Head from 'next/head';
import { useEffect } from 'react';
import { withTRPC } from '@trpc/next';
import type { AppType } from 'next/dist/shared/lib/utils';
import toast, { Toaster, useToasterStore } from 'react-hot-toast';
import { NextIntlProvider } from 'next-intl';
import superjson from 'superjson';
import { UserProvider } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';

import type { AppRouter } from '@/server/router';
import { DEFAULT_LANG } from '@/constants';
import '@/styles/globals.css';

const MyApp: AppType = ({ Component, pageProps }) => {
  const { toasts } = useToasterStore();

  const TOAST_LIMIT = 3;

  // limit number of react-hot-toast toasts to 3
  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <NextIntlProvider messages={pageProps.messages} locale={pageProps.locale ?? DEFAULT_LANG}>
        <UserProvider supabaseClient={supabaseClient}>
          <Component {...pageProps} />
          <Toaster />
        </UserProvider>
      </NextIntlProvider>
    </>
  );
};

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  if (process.browser) return ''; // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
