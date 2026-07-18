import { QueryClient, QueryCache } from '@tanstack/react-query';

// Create React Query client with global configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Layer 2: Global cache settings
      staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - garbage collection time
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
      retry: 1, // Retry failed requests once
      refetchOnMount: false, // Don't refetch on component mount if data is fresh
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      console.error('Query error:', error);
    },
  }),
});
