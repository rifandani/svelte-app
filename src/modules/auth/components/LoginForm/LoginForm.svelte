<script lang="ts">
  import { login } from '@auth/api/auth.api';
  import {
    loginSchema,
    type LoginApiResponseSchema,
    type LoginSchema,
  } from '@auth/api/auth.schema';
  import { createUserStore } from '@auth/stores/createUserStore.store';
  import { validator } from '@felte/validator-zod';
  import LL from '@i18n/i18n-svelte';
  import type { ErrorApiResponseSchema } from '@shared/api/error.schema';
  import { createMutation } from '@tanstack/svelte-query';
  import { createForm } from 'felte';
  import { push } from 'svelte-spa-router';

  //#region VALUES
  const user = createUserStore();
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
  <fieldset class="group/username form-control pt-4">
    <label class="label" for="username">
      <span class="label-text">{$LL.forms.username()}</span>
    </label>

    <input
      id="username"
      name="username"
      type="text"
      aria-label="textbox-username"
      aria-labelledby="#username"
      aria-invalid={$errors?.username?.length ? true : false}
      required
      placeholder={$LL.forms.usernamePlaceholder()}
      class="input input-primary mt-1 shadow-md aria-[invalid='true']:input-error"
    />

    {#if $errors?.username?.length}
      <p role="alert" class="pl-5 pt-1 text-error">
        {$LL.error.minLength({ field: 'username', length: 3 })}
      </p>
    {/if}
  </fieldset>

  <!-- password -->
  <fieldset class="group/password form-control pt-4">
    <label class="label" for="password">
      <span class="label-text">{$LL.forms.password()}</span>
    </label>

    <input
      id="password"
      name="password"
      role="textbox"
      type="password"
      aria-label="textbox-password"
      aria-labelledby="#password"
      aria-invalid={$errors?.password?.length ? true : false}
      required
      placeholder={$LL.forms.passwordPlaceholder()}
      class="input input-primary mt-1 shadow-md aria-[invalid='true']:input-error"
    />

    {#if $errors?.password?.length}
      <p role="alert" class="pl-5 pt-1 text-error">{$LL.error.passwordMinLength()}</p>
    {/if}
  </fieldset>

  {#if $loginMutation.isError}
    <div class="alert alert-error mt-3 shadow-lg">
      <p>{$LL.forms.error({ icon: '❌' })}</p>
    </div>
  {/if}

  <button
    aria-label="button-submit"
    class="btn-primary btn mt-8 normal-case"
    type="submit"
    disabled={!$isValid || $loginMutation.isLoading}
  >
    {$loginMutation.isLoading ? $LL.forms.loginLoading() : $LL.forms.login()}
  </button>
</form>
