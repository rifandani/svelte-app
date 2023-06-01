<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {},
    },
  });
</script>

<QueryClientProvider client={queryClient}>
  <slot {queryClient} />
</QueryClientProvider>
