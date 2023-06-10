<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { onMount } from 'svelte';
  import Router, { replace, type ConditionsFailedEvent } from 'svelte-spa-router';
  import { localStorageDetector } from 'typesafe-i18n/detectors';
  import { locale } from '../i18n/i18n-svelte';
  import { detectLocale } from '../i18n/i18n-util';
  import Toast from '../modules/shared/components/molecules/Toast.molecule.svelte';
  import { chooseLocaleAsync } from '../modules/shared/utils/helper.util';
  import { routes } from './route.app';

  const queryClient = new QueryClient();

  // set locale to localStorage everytime locale readable store changes
  $: $locale && localStorage.setItem('lang', $locale);

  const onConditionsFailed = (ev: ConditionsFailedEvent) => {
    // redirect to /login
    if (!ev.detail.userData || !('token' in ev.detail.userData)) void replace('/login');
    // redirect to /
    if (ev.detail.route === '/login' && 'token' in ev.detail.userData) void replace('/');
  };

  onMount(async () => {
    // detect locale based on localStorage
    const detectedLocale = detectLocale(localStorageDetector);
    // update locale
    await chooseLocaleAsync(detectedLocale);
  });
</script>

<QueryClientProvider client={queryClient}>
  <Router {routes} restoreScrollState on:conditionsFailed={onConditionsFailed} />
  <Toast />
</QueryClientProvider>
