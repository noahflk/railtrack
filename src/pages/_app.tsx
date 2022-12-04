import { createBrowserSupabaseClient, type Session } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { NextIntlProvider, type AbstractIntlMessages } from 'next-intl';
import PlausibleProvider from 'next-plausible';
import type { AppType } from 'next/dist/shared/lib/utils';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import toast, { Toaster, useToasterStore } from 'react-hot-toast';
import 'mapbox-gl/dist/mapbox-gl.css';

import ErrorBoundary from '@/components/ErrorBoundary';
import { DEFAULT_LANG } from '@/constants';
import '@/styles/globals.css';
import { trpc } from '@/utils/trpc';

type Props = {
  messages: AbstractIntlMessages;
  locale: string;
  initialSession: Session;
};

const MyApp: AppType<Props> = ({ Component, pageProps }) => {
  const { toasts } = useToasterStore();

  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

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
      <ErrorBoundary>
        <PlausibleProvider domain="railtrack.flk.li">
          <NextIntlProvider messages={pageProps.messages} locale={pageProps.locale ?? DEFAULT_LANG}>
            <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
              <Component {...pageProps} />
              <Toaster />
            </SessionContextProvider>
          </NextIntlProvider>
        </PlausibleProvider>
      </ErrorBoundary>
    </>
  );
};

export default trpc.withTRPC(MyApp);
