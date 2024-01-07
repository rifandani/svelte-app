<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // networkMode: 'offlineFirst'
        // gcTime: 1_000 * 60 * 5, // 5 mins. Defaults to 5 mins
        staleTime: 1_000 * 30, // 30 secs. Defaults to 0
      },
    },
  });
</script>

<QueryClientProvider client={queryClient}>
  <slot />
</QueryClientProvider>
