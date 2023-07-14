<script lang="ts">
  import { link } from 'svelte-spa-router';
  import LL from '../../../../i18n/i18n-svelte';
  import { createLocalStorage } from '../../../shared/stores/createLocalStorage.store';
  import type { LoginApiResponseSchema } from '../../api/auth.schema';

  let { store: user } = createLocalStorage<LoginApiResponseSchema>('user');
</script>

<main class="flex h-screen flex-col items-center justify-center space-y-3 text-primary-content">
  <h1 data-testid="notFound-title" class="text-3xl font-bold italic">{$LL.auth.notFound404()}</h1>
  <p data-testid="notFound-subtitle" class="mb-5">{$LL.auth.gone()}</p>

  <a
    use:link
    href={$user?.id ? '/' : '/login'}
    data-testid="notFound-link"
    class="link-neutral link hover:skew-x-12"
    >{$LL.auth.backTo({ isLoggedIn: $user?.id ? 'true' : 'false' })}</a
  >
</main>
