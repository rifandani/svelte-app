<script lang="ts">
  import Toast from '@shared/components/molecules/Toast.molecule.svelte';
  import I18nProvider from './I18nProvider.app.svelte';
  import QueryProvider from './QueryProvider.app.svelte';
  import RouterProvider from './RouterProvider.app.svelte';
</script>

<QueryProvider>
  <I18nProvider>
    <RouterProvider />
    <Toast />
  </I18nProvider>
</QueryProvider>
