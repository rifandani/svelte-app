<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import Router, { replace, type ConditionsFailedEvent } from 'svelte-spa-router';
  import { routes } from '../app/route.app';
  import Toast from '../modules/shared/components/molecules/Toast.molecule.svelte';

  const queryClient = new QueryClient();

  const onConditionsFailed = (ev: ConditionsFailedEvent) => {
    if (!ev.detail.userData || !('token' in ev.detail.userData)) replace('/login');
    if (ev.detail.route === '/login' && 'token' in ev.detail.userData) replace('/');
  };
</script>

<QueryClientProvider client={queryClient}>
  <Router {routes} restoreScrollState={true} on:conditionsFailed={onConditionsFailed} />
  <Toast />
</QueryClientProvider>
