<script lang="ts">
  import { createUserStore } from '@auth/stores/createUserStore.store';
  import LL from '@i18n/i18n-svelte';
  import Icon from '@iconify/svelte';
  import type { ErrorApiResponseSchema } from '@shared/api/error.schema';
  import { createToast } from '@shared/components/molecules/Toast/createToast.store';
  import Navbar from '@shared/components/organisms/Navbar/Navbar.svelte';
  import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
  import { todoApi, todoKeys } from '@todo/api/todo.api';
  import type { UpdateTodoApiResponseSchema, UpdateTodoSchema } from '@todo/api/todo.schema';
  import { createTodoDetailParams } from '@todo/stores/createTodoDetailParams.store';
  import { createForm } from 'felte';
  import { link, params, push } from 'svelte-spa-router';
  import { derived } from 'svelte/store';
  import { z } from 'zod';

  //#region VALUES
  const { toaster } = createToast();
  const queryClient = useQueryClient();
  const user = createUserStore();
  const id = derived(params, ($params) => {
    // initial load, `$params === undefined`
    // -1 to make query options `enabled: false`
    if (!$params) return -1;

    // will throw error if `params.id` is not a number
    const id = z.coerce.number().parse($params.id);
    return Number(id);
  });
  const { enabled, queryKey } = createTodoDetailParams(id);

  $: todoQuery = createQuery({
    enabled: $enabled,
    queryKey: $queryKey,
    queryFn: ({ queryKey }) => todoApi.detail(queryKey[2]),
  });
  $: todoUpdateMutation = createMutation<
    UpdateTodoApiResponseSchema,
    ErrorApiResponseSchema,
    UpdateTodoSchema
  >({
    mutationFn: (updateTodo) => todoApi.update(updateTodo),
    onSuccess: async (updatedTodo) => {
      // NOTE: the order of function call MATTERS
      await push('/todos');
      queryClient.removeQueries({ queryKey: todoKeys.detail(updatedTodo.id) }); // delete the query cache
      await queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
    onSettled: (_updateTodo, error) => {
      toaster.create({
        type: error ? 'error' : 'success',
        title: error
          ? $LL.common.xUpdateError({ feature: 'Todo' })
          : $LL.common.xUpdateSuccess({ feature: 'Todo' }),
      });
    },
  });
  const { form } = createForm<Pick<UpdateTodoSchema, 'todo'>>({
    onSubmit: (values) => {
      const payload: UpdateTodoSchema = {
        ...values,
        id: $todoQuery.data?.id ?? 1,
        completed: $todoQuery.data?.completed ?? false,
      };

      $todoUpdateMutation.mutate(payload);
    },
  });
  //#endregion
</script>

<Navbar>
  <section class="flex flex-col justify-center px-10 py-20 md:px-24 lg:px-40 xl:px-52">
    <div class="mb-10 flex w-full flex-col space-y-2">
      <a use:link aria-label="go-back" href="/todos" class="link w-fit normal-case hover:skew-x-12">
        ⬅ {$LL.todo.backTo({ target: 'Todos' })}
      </a>

      <h1 class="text-2xl font-semibold tracking-wider">
        {$LL.common.xDetail({ feature: 'Todo' })}
      </h1>
    </div>

    {#if $todoUpdateMutation.isError}
      <div data-testid="todo-mutationError" class="alert alert-error mt-2 shadow-lg">
        <div class="flex items-center">
          <span>
            {$LL.common.error({ module: 'Todo Mutation' })}
          </span>
          <pre>{JSON.stringify($todoUpdateMutation.error.message, null, 2)}</pre>
        </div>
      </div>
    {/if}

    {#if $todoQuery.isLoading}
      <div data-testid="todo-loading" class="flex items-center justify-center py-5">
        <Icon icon="svg-spinners:3-dots-fade" height="5em" class="text-primary-content" />
      </div>
    {/if}

    {#if $todoQuery.isError}
      <div data-testid="todo-error" class="alert alert-error mt-2 shadow-lg">
        <div class="flex items-center">
          <span>{$LL.common.error({ module: 'Todos' })}:</span>
          <pre>{JSON.stringify($todoQuery.error, null, 2)}</pre>
        </div>
      </div>
    {/if}

    {#if $todoQuery.isSuccess && $todoQuery.data}
      <form use:form aria-label="form-todo" class="join">
        <input
          aria-label="textbox-todo"
          class="input-bordered input-primary input join-item w-full"
          name="todo"
          id="todo"
          type="text"
          required
          value={$todoQuery.data.todo ?? $LL.common.loading()}
        />

        {#if $user?.id === $todoQuery.data.userId}
          <button
            aria-label="button-submit"
            class="btn-primary join-item btn normal-case disabled:btn-disabled"
            type="submit"
            disabled={$todoUpdateMutation.isLoading}
          >
            {$LL.common.update({ icon: '🖋' })}
          </button>
        {/if}
      </form>
    {/if}
  </section>
</Navbar>
