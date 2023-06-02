<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import type { ComponentType } from 'svelte';

  export let component: ComponentType;

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
  <svelte:component this={component} {...$$restProps} />
</QueryClientProvider>
