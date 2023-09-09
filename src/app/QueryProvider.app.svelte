<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1_000 * 30, // 30sec, this is the default in v5
      },
    },
  });
</script>

<QueryClientProvider client={queryClient}>
  <slot />
</QueryClientProvider>
