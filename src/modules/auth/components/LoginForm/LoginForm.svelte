<script lang="ts">
  import { validator } from '@felte/validator-zod';
  import { createMutation } from '@tanstack/svelte-query';
  import { createForm } from 'felte';
  import { push } from 'svelte-spa-router';
  import { twMerge } from 'tailwind-merge';
  import LL from '../../../../i18n/i18n-svelte';
  import type { ErrorApiResponseSchema } from '../../../shared/api/error.schema';
  import { createLocalStorage } from '../../../shared/stores/createLocalStorage.store';
  import { login } from '../../api/auth.api';
  import {
    loginSchema,
    type LoginApiResponseSchema,
    type LoginSchema,
  } from '../../api/auth.schema';

  //#region VALUES
  let { store: user } = createLocalStorage<LoginApiResponseSchema>('user');

  const loginMutation = createMutation<LoginApiResponseSchema, ErrorApiResponseSchema, LoginSchema>(
    {
      mutationFn: (creds) => login(creds),
      onSuccess: async (resp) => {
        // set user data to local storage
        user.set(resp);
        await push('/');
      },
    },
  );

  const { form, isValid, errors } = createForm<LoginSchema>({
    extend: [validator({ schema: loginSchema })],
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: (values, { reset }) => {
      $loginMutation.mutate(values, {
        onError: () => {
          // reset form
          reset();
        },
      });
    },
  });
  //#endregion
</script>

<form aria-label="form-login" class="form-control pt-3 md:pt-8" use:form>
  <!-- username -->
  <div class="form-control pt-4">
    <label class="label" for="username">
      <span class="label-text">{$LL.forms.username()}</span>
    </label>

    <input
      id="username"
      name="username"
      aria-label="textbox-username"
      aria-labelledby="#username"
      type="text"
      required
      placeholder={$LL.forms.usernamePlaceholder()}
      class={twMerge(
        'input mt-1 shadow-md',
        $errors?.username?.length ? 'input-error' : 'input-primary',
      )}
    />

    {#if $errors?.username?.length}
      <p class="pl-5 pt-1 text-error">{$LL.error.minLength({ field: 'username', length: 3 })}</p>
    {/if}
  </div>

  <!-- password -->
  <div class="form-control pt-4">
    <label class="label" for="password">
      <span class="label-text">{$LL.forms.password()}</span>
    </label>

    <input
      id="password"
      name="password"
      role="textbox"
      aria-label="textbox-password"
      aria-labelledby="#password"
      type="password"
      required
      placeholder={$LL.forms.passwordPlaceholder()}
      class={twMerge(
        'input mt-1 shadow-md',
        $errors?.password?.length ? 'input-error' : 'input-primary',
      )}
    />

    {#if $errors?.password?.length}
      <p class="pl-5 pt-1 text-error">{$LL.error.passwordMinLength()}</p>
    {/if}
  </div>

  {#if $loginMutation.isError}
    <div class="alert alert-error mt-3 shadow-lg">
      <div class="flex flex-col items-start">
        <span>{$LL.forms.error({ icon: '❌' })}</span>
      </div>
    </div>
  {/if}

  <button
    id="button-submit"
    class="btn-primary btn mt-8 normal-case"
    type="submit"
    disabled={!$isValid || $loginMutation.isLoading}
  >
    {$loginMutation.isLoading ? $LL.forms.loginLoading() : $LL.forms.login()}
  </button>
</form>
