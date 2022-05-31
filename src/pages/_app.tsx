import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/globals.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import type { AppProps } from 'next/app';
import toast, { Toaster, useToasterStore } from 'react-hot-toast';

import { UserContextProvider } from '@/hooks/useSession';
import { useEffect } from 'react';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
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
    <UserContextProvider>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <Toaster />
      </QueryClientProvider>
    </UserContextProvider>
  );
}

export default MyApp;
