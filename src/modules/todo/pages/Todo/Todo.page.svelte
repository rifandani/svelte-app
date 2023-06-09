<script lang="ts">
  import Icon from '@iconify/svelte';
  import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
  import { createForm } from 'felte';
  import { link, params, push } from 'svelte-spa-router';
  import { derived } from 'svelte/store';
  import { z } from 'zod';
  import LL from '../../../../i18n/i18n-svelte';
  import type { ErrorApiResponseSchema } from '../../../shared/api/error.schema';
  import { Navbar } from '../../../shared/components/organisms';
  import { createToast } from '../../../shared/stores/createToast.store';
  import { todoApi, todoKeys } from '../../api/todo.api';
  import type { UpdateTodoApiResponseSchema, UpdateTodoSchema } from '../../api/todo.schema';
  import { createTodoDetailQuery } from '../../stores/createTodoDetailQuery.store';

  //#region VALUES
  const id = derived(params, ($params) => {
    // initial load, `$params === undefined`
    // -1 to make query options `enabled: false`
    if (!$params) return -1;

    // will throw error if `params.id` is not a number
    const id = z.coerce.number().parse($params.id);
    return Number(id);
  });
  const { queryOptions } = createTodoDetailQuery(id);
  const { toaster } = createToast();
  const queryClient = useQueryClient();

  $: todoQuery = createQuery($queryOptions);
  $: todoUpdateMutation = createMutation<
    UpdateTodoApiResponseSchema,
    ErrorApiResponseSchema,
    UpdateTodoSchema
  >({
    mutationFn: (updateTodo) => todoApi.update(updateTodo),
    onSuccess: async (updatedTodo) => {
      // NOTE: the order of function call MATTERS
      push('/todos');
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
        id: $todoQuery.data?.id,
        completed: $todoQuery.data?.completed,
      };

      $todoUpdateMutation.mutate(payload);
    },
  });
  //#endregion
</script>

<Navbar>
  <section class="flex flex-col justify-center px-10 py-20 md:px-24 lg:px-40 xl:px-52">
    <div class="mb-10 flex w-full flex-col space-y-2">
      <a use:link href="/todos" class="btn-link w-fit normal-case text-primary-content">
        ⬅ {$LL.todo.backTo({ target: 'Todos' })}
      </a>

      <h1 class="text-2xl font-semibold tracking-wider text-primary-content">
        {$LL.common.xDetail({ feature: 'Todo' })}
      </h1>
    </div>

    {#if $todoUpdateMutation.isError}
      <div class="alert alert-error mt-2 shadow-lg">
        <div class="flex items-center">
          <span>
            {$LL.common.error({ module: 'Todo Mutation' })}:{' '}
            {$todoUpdateMutation.error.message}
          </span>
        </div>
      </div>
    {/if}

    {#if $todoQuery.isLoading}
      <div class="flex items-center justify-center py-5">
        <Icon icon="svg-spinners:3-dots-fade" height="5em" class="text-secondary-content" />
      </div>
    {/if}

    {#if $todoQuery.isError}
      <div class="alert alert-error mt-2 shadow-lg">
        <div class="flex items-center">
          <span>{$LL.common.error({ module: 'Todos' })}:</span>
          <pre>{JSON.stringify($todoQuery.error, null, 2)}</pre>
        </div>
      </div>
    {/if}

    {#if $todoQuery.isSuccess}
      <form use:form data-testid="form" class="join">
        <input
          data-testid="input-todo"
          class="input-bordered input-accent input join-item w-full text-accent-content"
          name="todo"
          id="todo"
          type="text"
          required
          value={$todoQuery.data?.todo ?? $LL.common.loading()}
        />

        <button
          data-testid="button-submit"
          class="btn-accent join-item btn normal-case"
          type="submit"
        >
          {$LL.common.update({ icon: '🖋' })}
        </button>
      </form>
    {/if}
  </section>
</Navbar>
