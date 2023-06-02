<script lang="ts">
  import { createMutation } from '@tanstack/svelte-query';
  import { push } from 'svelte-spa-router';
  import type { HTMLFormAttributes } from 'svelte/elements';
  import LL from '../../../../i18n/i18n-svelte';
  import { useLocalStorage } from '../../../shared/hooks/useLocalStorage.hook';
  import type { ErrorApiResponseSchema } from '../../../shared/models/Error.model';
  import { login } from '../../api/auth.api';
  import type { LoginApiResponseSchema, LoginSchema } from '../../api/auth.schema';

  let username = '';
  let password = '';

  // get 'user' store
  let { store: user } = useLocalStorage<LoginApiResponseSchema>('user');

  const loginMutation = createMutation<LoginApiResponseSchema, ErrorApiResponseSchema, LoginSchema>(
    {
      mutationFn: (creds) => login(creds),
      onSuccess: async (resp) => {
        user.set(resp);
        await push('/');
      },
      onError: (_err) => {
        username = '';
        password = '';
      },
    },
  );

  const onSubmit: HTMLFormAttributes['on:submit'] = () => {
    $loginMutation.mutate({ username, password });
  };
</script>

<form data-testid="form" class="form-control pt-3 md:pt-8" on:submit|preventDefault={onSubmit}>
  <!-- username -->
  <div class="form-control pt-4">
    <label class="label" for="username">
      <span class="label-text">{$LL.forms.username()}</span>
    </label>

    <input
      data-testid="input-username"
      class="input-bordered input-primary input mt-1 shadow-md"
      placeholder={$LL.forms.usernamePlaceholder()}
      name="username"
      type="text"
      required
      bind:value={username}
    />
  </div>

  <!-- password -->
  <div class="form-control pt-4">
    <label class="label" for="password">
      <span class="label-text">{$LL.forms.password()}</span>
    </label>

    <input
      data-testid="input-password"
      class="input-bordered input-primary input mt-1 shadow-md"
      placeholder={$LL.forms.passwordPlaceholder()}
      type="password"
      name="password"
      required
      bind:value={password}
    />
  </div>

  {#if $loginMutation.isError}
    <div class="alert alert-error mt-3 shadow-lg">
      <div class="flex flex-col items-start">
        <span>{$LL.forms.error({ icon: '❌' })}</span>
      </div>
    </div>
  {/if}

  <button
    data-testid="button-submit"
    class="btn-primary btn mt-8 normal-case"
    type="submit"
    disabled={$loginMutation.isLoading}
  >
    {$loginMutation.isLoading ? $LL.forms.loginLoading() : $LL.forms.login()}
  </button>
</form>
