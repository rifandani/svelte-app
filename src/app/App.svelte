<script lang="ts">
  import Toast from '@shared/components/molecules/Toast/Toast.svelte';
  import I18nProvider from './I18nProvider.svelte';
  import QueryProvider from './QueryProvider.svelte';
  import RouterProvider from './RouterProvider.svelte';
</script>

<QueryProvider>
  <I18nProvider>
    <RouterProvider />
    <Toast />
  </I18nProvider>
</QueryProvider>
