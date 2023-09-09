<script lang="ts">
  import { createUserStore } from '@auth/stores/createUserStore.store';
  import LL from '@i18n/i18n-svelte';
  import { modes } from '@shared/constants/global.constant';
  import { createColorMode } from '@shared/stores/createColorMode.store';
  import { link } from 'svelte-spa-router';

  createColorMode({
    modes,
    attribute: 'data-theme',
  });
  const user = createUserStore();
</script>

<main class="flex h-screen flex-col items-center justify-center space-y-3 bg-base-100">
  <h1 class="text-3xl font-bold italic">{$LL.auth.notFound404()}</h1>
  <p class="mb-5">{$LL.auth.gone()}</p>

  <a use:link href={$user?.id ? '/' : '/login'} class="link hover:skew-x-12"
    >{$LL.auth.backTo({ isLoggedIn: $user?.id ? 'true' : 'false' })}</a
  >
</main>
