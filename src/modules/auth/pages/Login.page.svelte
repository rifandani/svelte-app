<script lang="ts">
  import { createMutation } from '@tanstack/svelte-query';
  import { link, push } from 'svelte-spa-router';
  import type { HTMLFormAttributes } from 'svelte/elements';
  import { fade, fly } from 'svelte/transition';
  import svelteCyber from '../../../assets/svelte-cyber.avif';
  import LL from '../../../i18n/i18n-svelte';
  import { Icon, WrapTranslation } from '../../shared/components/atoms';
  import { useLocalStorage } from '../../shared/hooks/useLocalStorage.hook';
  import type { ErrorApiResponseSchema } from '../../shared/models/Error.model';
  import { login } from '../api/auth.api';
  import type { LoginApiResponseSchema, LoginSchema } from '../api/auth.schema';

  // login form
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

<main in:fly={{ y: 50, duration: 1000 }} out:fade class="h-screen bg-white">
  <div class="flex w-full flex-wrap">
    <!-- Login Section -->
    <section class="flex w-full flex-col md:w-1/2">
      <div class="flex justify-center pt-12 md:-mb-24 md:justify-start md:pl-12">
        <a use:link href="/" class="relative cursor-pointer">
          <Icon.Home class="h-8 w-8 rounded-full hover:text-primary" />
        </a>
      </div>

      <div
        class="my-auto flex flex-col justify-center px-8 pt-8 md:justify-start md:px-24 md:pt-0 lg:px-32"
      >
        <p class="text-center text-3xl text-primary" data-testid="loginHeaderTitle">
          {$LL.auth.welcome()}
        </p>

        <!-- Start FORM -->
        <form class="form-control pt-3 md:pt-8" on:submit|preventDefault={onSubmit}>
          <!-- username -->
          <div class="form-control pt-4">
            <label class="label" for="username">
              <span class="label-text">{$LL.forms.username()}</span>
            </label>

            <input
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
            class="btn-primary btn mt-8 normal-case"
            type="submit"
            disabled={$loginMutation.isLoading}
          >
            {$loginMutation.isLoading ? $LL.forms.loginLoading() : $LL.forms.login()}
          </button>
        </form>
        <!-- End FORM -->

        <div class="py-12 text-center">
          <p>
            <WrapTranslation message={$LL.auth.registerHere()} let:infix>
              <a use:link href="/register" class="link-primary link">{infix}</a>
            </WrapTranslation>
          </p>
        </div>
      </div>
    </section>

    <!-- Image Section -->
    <section class="w-1/2 shadow-2xl">
      <span class="relative hidden h-screen w-full md:flex md:items-center md:justify-center">
        <img src={svelteCyber} alt="login page cover" loading="lazy" />
      </span>
    </section>
  </div>
</main>
