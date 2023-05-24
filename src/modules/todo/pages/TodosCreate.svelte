<script lang="ts">
  import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
  import { querystring } from 'svelte-spa-router';
  import type { HTMLFormAttributes } from 'svelte/elements';
  import { writable } from 'svelte/store';
  import type { LoginApiResponseSchema } from '../../auth/models/Auth.model';
  import { useLocalStorage } from '../../shared/hooks/useLocalStorage.hook';
  import type { ErrorApiResponseSchema } from '../../shared/models/Error.model';
  import { mutationKeyFactory, queryKeyFactory } from '../../shared/services/api/keyFactory.api';
  import { createToast } from '../../shared/stores/createToast.store';
  import { createTodo } from '../api/todos.api';
  import type {
    CreateTodoApiResponseSchema,
    TodoListApiResponseSchema,
  } from '../models/Todo.model';
  import { defaultLimit } from './Todos.page.svelte';

  $: searchParams = new URLSearchParams(`?${$querystring}`);
  $: queryParams = Object.fromEntries(searchParams);
  $: queryOptions = writable(
    queryKeyFactory.todos.list(
      queryParams && Object.keys(queryParams).length ? queryParams : undefined,
    ),
  );
  $: todosQuery = createQuery($queryOptions);

  const { toaster } = createToast();
  const queryClient = useQueryClient();
  const { store: user } = useLocalStorage<LoginApiResponseSchema>('user');
  let todo = '';

  const createTodoMutation = createMutation({
    // Called before `mutationFn`:
    onMutate: async (newTodo: CreateTodoApiResponseSchema) => {
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

  const onSubmit: HTMLFormAttributes['on:submit'] = () => {
    $createTodoMutation.mutate({
      id: $todosQuery.data?.todos[$todosQuery.data?.todos.length - 1].id + 1,
      todo,
      userId: $user.id,
      completed: false,
    });
  };
</script>

<form class="form-control mb-3 w-full duration-300 lg:flex-row" on:submit|preventDefault={onSubmit}>
  <input
    bind:value={todo}
    class="input-bordered input-accent input text-accent-content w-full lg:w-10/12"
    placeholder="What should you do next..."
    name="todo"
    id="todo"
    type="text"
    required
  />

  <button
    class="btn-accent btn ml-0 mt-2 w-full normal-case lg:ml-2 lg:mt-0 lg:w-2/12"
    type="submit"
  >
    Add ✔
  </button>
</form>
