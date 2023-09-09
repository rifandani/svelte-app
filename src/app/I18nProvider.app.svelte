<script lang="ts">
  import { locale, setLocale } from '@i18n/i18n-svelte';
  import { detectLocale } from '@i18n/i18n-util';
  import { chooseLocaleSync } from '@shared/utils/helper/helper.util';
  import { onMount } from 'svelte';
  import {
    htmlLangAttributeDetector,
    localStorageDetector,
    navigatorDetector,
  } from 'typesafe-i18n/detectors';

  // set locale to localStorage everytime locale readable store changes
  $: $locale && localStorage.setItem('lang', $locale);

  onMount(() => {
    // detect locale. The detectors order matters.
    const detectedLocale = detectLocale(
      navigatorDetector,
      htmlLangAttributeDetector,
      localStorageDetector,
    );
    // update locale
    chooseLocaleSync(detectedLocale);
    setLocale(detectedLocale);
  });
</script>

<slot />
