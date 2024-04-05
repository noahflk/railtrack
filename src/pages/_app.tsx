import { createPagesBrowserClient, type Session } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl';
import type { AppType } from 'next/dist/shared/lib/utils';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import toast, { Toaster, useToasterStore } from 'react-hot-toast';

import ErrorBoundary from '@/components/ErrorBoundary';
import { DEFAULT_LANG } from '@/constants';
import '@/styles/globals.css';
import { trpc } from '@/utils/trpc';
import Script from 'next/script';

type Props = {
  messages: AbstractIntlMessages;
  locale: string;
  initialSession: Session;
};

const MyApp: AppType<Props> = ({ Component, pageProps }) => {
  const { toasts } = useToasterStore();
  const { mutate: invalidateLanguage } = trpc.settings.invalidateLanguage.useMutation();

  // Here we create a new instance of the Supabase client for browser-side operations
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  const TOAST_LIMIT = 3;

  // Limit the number of react-hot-toast toasts to 3
  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  // Invalidate language cookie and fetch new one on every page load
  useEffect(() => {
    invalidateLanguage();
  }, [invalidateLanguage]);

  const timeZone = 'Europe/Zurich';

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <ErrorBoundary>
        <NextIntlClientProvider
          messages={pageProps.messages}
          locale={pageProps.locale ?? DEFAULT_LANG}
          timeZone={timeZone}
        >
          <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
            <Component {...pageProps} />
            <Script
              src="https://p-proxy.flk.li/static/files/p.js"
              id="pirschjs"
              data-endpoint="https://p-proxy.flk.li/p/pv"
            />
            <Toaster />
          </SessionContextProvider>
        </NextIntlClientProvider>
      </ErrorBoundary>
    </>
  );
};

export default trpc.withTRPC(MyApp);
