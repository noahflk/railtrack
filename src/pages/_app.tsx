import "mapbox-gl/dist/mapbox-gl.css";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

import { UserContextProvider } from "@/hooks/useSession";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
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
