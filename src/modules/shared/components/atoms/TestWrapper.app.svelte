<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { onMount, type ComponentType } from 'svelte';
  import { localStorageDetector } from 'typesafe-i18n/detectors';
  import { locale, setLocale } from '../../../../i18n/i18n-svelte';
  import { detectLocale } from '../../../../i18n/i18n-util';
  import { chooseLocaleSync } from '../../utils/helper.util';

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
      error: () => void 0,
    },
  });

  // set locale to localStorage everytime locale readable store changes
  $: $locale && localStorage.setItem('lang', $locale);

  onMount(() => {
    // detect locale based on localStorage
    const detectedLocale = detectLocale(localStorageDetector);
    // update locale
    chooseLocaleSync(detectedLocale);
    setLocale(detectedLocale);
  });
</script>

<QueryClientProvider client={queryClient}>
  <svelte:component this={component} {...$$restProps} />
</QueryClientProvider>
