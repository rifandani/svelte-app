<script lang="ts">
  import { link } from 'svelte-spa-router';
  import LL from '../../../i18n/i18n-svelte';
  import type { LoginApiResponseSchema } from '../../auth/api/auth.schema';
  import { useLocalStorage } from '../hooks/useLocalStorage.hook';

  let { store: user } = useLocalStorage<LoginApiResponseSchema>('user');
</script>

<main class="flex h-screen flex-col items-center justify-center space-y-3 text-primary-content">
  <h1 class="text-3xl font-bold italic">{$LL.auth.notFound404()}</h1>
  <p class="mb-5">{$LL.auth.gone()}</p>

  <a use:link href={$user?.id ? '/' : '/login'} class="link-neutral link hover:skew-x-12"
    >{$LL.auth.backTo({ isLoggedIn: $user?.id ? 'true' : 'false' })}</a
  >
</main>
