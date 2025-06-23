"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useRef } from "react";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
export default function TanstackProvider({
  children,
}: {
  children: ReactNode;
}) {
  const queryClientRef = useRef<QueryClient | null>(null);
  
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
