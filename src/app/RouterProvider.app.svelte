<script lang="ts">
  import Router, { replace, type ConditionsFailedEvent } from 'svelte-spa-router';
  import { routes } from './route.app';

  const onConditionsFailed = (ev: ConditionsFailedEvent) => {
    // redirect to /login
    if (!ev.detail.userData || !('token' in ev.detail.userData)) void replace('/login');
    // redirect to /
    if (ev.detail.route === '/login' && ev.detail.userData && 'token' in ev.detail.userData)
      void replace('/');
  };
</script>

<Router {routes} restoreScrollState on:conditionsFailed={onConditionsFailed} />
<slot />
