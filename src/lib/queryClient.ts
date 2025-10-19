/**
 * Production-ready React Query configuration
 *
 * Configures caching, retries, and refetching behavior for optimal
 * performance and user experience.
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 1 minute before considering it stale
      staleTime: 60 * 1000, // 1 minute

      // Keep unused data in cache for 5 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)

      // Retry failed requests once
      retry: 1,

      // Refetch on window focus to ensure fresh data
      refetchOnWindowFocus: true,

      // Refetch when network reconnects
      refetchOnReconnect: true,

      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
    },
    mutations: {
      // Don't retry mutations by default (user should retry explicitly)
      retry: 0,
    },
  },
});
