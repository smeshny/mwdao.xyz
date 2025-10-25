"use client";

import { type ReactNode, useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const THIRTY_SECONDS = 30;
const THOUSAND_MS = 1000;
const STALE_TIME_MS = THIRTY_SECONDS * THOUSAND_MS; // 30 seconds

type QueryClientProviderProps = {
  children: ReactNode;
};

export function Providers({ children }: QueryClientProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: STALE_TIME_MS,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
