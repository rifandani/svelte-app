<script lang="ts">
  import {
    createMutation,
    useQueryClient,
    type CreateQueryResult,
    type QueryOptions,
  } from '@tanstack/svelte-query';
  import type { HTMLFormAttributes } from 'svelte/elements';
  import type { Readable } from 'svelte/store';
  import LL from '../../../../i18n/i18n-svelte';
  import type { LoginApiResponseSchema } from '../../../auth/api/auth.schema';
  import { useLocalStorage } from '../../../shared/hooks/useLocalStorage.hook';
  import type { ErrorApiResponseSchema } from '../../../shared/models/Error.model';
  import { mutationKeyFactory } from '../../../shared/services/api/keyFactory.api';
  import { createToast } from '../../../shared/stores/createToast.store';
  import { createTodo } from '../../api/todo.api';
  import type {
    CreateTodoApiResponseSchema,
    CreateTodoSchema,
    TodoListApiResponseSchema,
  } from '../../api/todo.schema';
  import { defaultLimit } from '../../pages/Todos.page.svelte';

  export let queryParams: Record<PropertyKey, string>;
  export let queryOptions: Readable<QueryOptions>;
  export let todosQuery: CreateQueryResult<TodoListApiResponseSchema, unknown>;

  //#region VALUES
  const { toaster } = createToast();
  const queryClient = useQueryClient();
  const { store: user } = useLocalStorage<LoginApiResponseSchema>('user');
  let todo = '';

  const createTodoMutation = createMutation<
    CreateTodoApiResponseSchema,
    ErrorApiResponseSchema,
    CreateTodoSchema,
    { previousTodosQueryResponse: TodoListApiResponseSchema }
  >({
    // Called before `mutationFn`:
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: $queryOptions.queryKey });

      // Snapshot the previous value
      const previousTodosQueryResponse: TodoListApiResponseSchema = queryClient.getQueryData(
        $queryOptions.queryKey,
      );

      // Optimistically update to the new value & delete the last value
      queryClient.setQueryData($queryOptions.queryKey, {
        ...previousTodosQueryResponse,
        todos: [
          newTodo,
          ...previousTodosQueryResponse.todos.slice(
            0,
            Number(queryParams.limit || defaultLimit) - 1,
          ),
        ],
      });

      // Return a context object with the snapshotted value
      return { previousTodosQueryResponse };
    },
    mutationKey: mutationKeyFactory.todos.create().mutationKey,
    mutationFn: (newTodo) => createTodo(newTodo),
    onSettled: (_newTodo, error: ErrorApiResponseSchema, _variables, context) => {
      todo = '';

      toaster.create({
        type: error ? 'error' : 'success',
        title: error ? 'Todo failed to create' : 'Todo successfully created',
      });

      // If the mutation fails, use the context returned from `onMutate` to roll back
      if (error)
        queryClient.setQueryData($queryOptions.queryKey, context.previousTodosQueryResponse);

      // if we want to refetch after error or success:
      // queryClient.invalidateQueries({ queryKey: $queryOptions.queryKey });
    },
  });
  //#endregion

  //#region HANDLERS
  const onSubmit: HTMLFormAttributes['on:submit'] = () => {
    $createTodoMutation.mutate({
      todo,
      id: $todosQuery?.data?.todos[$todosQuery?.data?.todos.length - 1].id + 1,
      userId: $user.id,
      completed: false,
    });
  };
  //#endregion
</script>

<form
  data-testid="form"
  class="form-control mb-3 w-full duration-300 lg:flex-row"
  on:submit|preventDefault={onSubmit}
>
  <input
    data-testid="input-todo"
    class="input-bordered input-accent input text-accent-content w-full lg:w-10/12"
    placeholder={$LL.forms.todoPlaceholder()}
    name="todo"
    id="todo"
    type="text"
    required
    bind:value={todo}
  />

  <button
    data-testid="button-submit"
    class="btn-accent btn ml-0 mt-2 w-full normal-case lg:ml-2 lg:mt-0 lg:w-2/12"
    type="submit"
  >
    {$LL.forms.add({ icon: '✔' })}
  </button>
</form>
