<script context="module">
  // Code contained inside it will run once, when the module first evaluates, rather than when a component is instantiated.
  export const defaultLimit = '10';
</script>

<script lang="ts">
  import TodosFilter from './TodosFilter.svelte';

  import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
  import { querystring } from 'svelte-spa-router';
  import type { HTMLFormAttributes } from 'svelte/elements';
  import { writable } from 'svelte/store';
  import { LoadingSpinner } from '../../shared/components/atoms';
  import { Navbar } from '../../shared/components/organisms';
  import type { ErrorApiResponseSchema } from '../../shared/models/Error.model';
  import { mutationKeyFactory, queryKeyFactory } from '../../shared/services/api/keyFactory.api';
  import { createToast } from '../../shared/stores/createToast.store';
  import { deleteTodoById, todosQueryKeys, updateTodoById } from '../api/todos.api';
  import TodoItem from '../components/TodoItem/TodoItem.svelte';
  import type {
    DeleteTodoSchema,
    TodoListApiResponseSchema,
    TodoSchema,
    UpdateTodoSchema,
  } from '../models/Todo.model';
  import TodosCreate from './TodosCreate.svelte';

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
  let todo = '';

  const updateTodoMutation = createMutation({
    // Called before `mutationFn`:
    onMutate: async ({ id, ...body }: UpdateTodoSchema) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: $queryOptions.queryKey });

      // Snapshot the previous value
      const previousTodosQueryResponse: TodoListApiResponseSchema = queryClient.getQueryData(
        $queryOptions.queryKey,
      );

      // Optimistically update to the new value
      queryClient.setQueryData($queryOptions.queryKey, {
        ...previousTodosQueryResponse,
        todos: previousTodosQueryResponse.todos.map((_todo) =>
          _todo.id === id ? { ..._todo, ...body } : _todo,
        ),
      });

      // Return a context object with the snapshotted value
      return { previousTodosQueryResponse };
    },
    mutationKey: mutationKeyFactory.todos.updateById().mutationKey,
    mutationFn: (updateTodo) => updateTodoById(updateTodo),
    onSettled: (_id, error: ErrorApiResponseSchema, _variables, context) => {
      toaster.create({
        type: error ? 'error' : 'success',
        title: error ? 'Todo failed to update' : 'Todo successfully updated',
      });

      // If the mutation fails, use the context returned from `onMutate` to roll back
      if (error)
        queryClient.setQueryData($queryOptions.queryKey, context.previousTodosQueryResponse);

      // if we want to refetch after error or success:
      // queryClient.invalidateQueries({ queryKey: $queryOptions.queryKey });
    },
  });

  const deleteTodoMutation = createMutation({
    // Called before `mutationFn`:
    onMutate: async (id: DeleteTodoSchema['id']) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: $queryOptions.queryKey });

      // Snapshot the previous value
      const previousTodosQueryResponse: TodoListApiResponseSchema = queryClient.getQueryData(
        $queryOptions.queryKey,
      );

      // Optimistically update to the new value
      queryClient.setQueryData($queryOptions.queryKey, {
        ...previousTodosQueryResponse,
        todos: previousTodosQueryResponse.todos.filter((_todo) => _todo.id !== id),
      });

      // Return a context object with the snapshotted value
      return { previousTodosQueryResponse };
    },
    mutationKey: mutationKeyFactory.todos.deleteById().mutationKey,
    mutationFn: (id) => deleteTodoById(id),
    onSettled: (_id, error: ErrorApiResponseSchema, _variables, context) => {
      todo = '';

      toaster.create({
        type: error ? 'error' : 'success',
        title: error ? 'Todo failed to delete' : 'Todo successfully deleted',
      });

      // If the mutation fails, use the context returned from `onMutate` to roll back
      if (error)
        queryClient.setQueryData($queryOptions.queryKey, context.previousTodosQueryResponse);

      // if we want to refetch after error or success:
      // queryClient.invalidateQueries({ queryKey: $queryOptions.queryKey });
    },
  });

  $: console.log('🚀 ~ file: Todos.page.svelte:119', {
    todosQueryKeys: todosQueryKeys.list._def,
    $queryOptions: $queryOptions.queryKey,
    todosQueryKeysTodos: queryClient.getQueryData(todosQueryKeys.list._def),
    $queryOptionsTodos: queryClient.getQueryData($queryOptions.queryKey),
    queryCache: queryClient.getQueryCache(),
    $updateTodoMutation,
    $deleteTodoMutation,
  });

  const onChangeTodo = (_ev: CustomEvent<TodoSchema>) => {
    $updateTodoMutation.mutate({ ..._ev.detail, completed: !_ev.detail.completed });
  };

  const onDeleteTodo: HTMLFormAttributes['on:submit'] = (ev) => {
    // parse form data & get todo id from input hidden with name/id `todoId`
    const formData = new FormData(ev.currentTarget);
    const { todoId } = Object.fromEntries(formData.entries());

    $deleteTodoMutation.mutate(Number(todoId));
  };
</script>

<Navbar>
  <main
    class="flex flex-col items-center justify-center px-10 py-20 duration-300 md:px-24 lg:px-40 xl:px-52"
  >
    <h1 class="text-primary-content mb-10 text-2xl font-semibold tracking-wider">Todo List</h1>

    <section
      class="card bg-secondary text-secondary-content w-full rounded-lg border p-5 shadow-lg"
    >
      <TodosCreate />

      <TodosFilter />

      {#if $todosQuery.isLoading || $todosQuery.isFetching}
        <div class="flex items-center justify-center py-5">
          <LoadingSpinner stroke="currentColor" />
        </div>
      {/if}

      {#if $todosQuery.isError}
        <div class="alert alert-error mt-2 shadow-lg">
          <div class="flex items-center">
            <span>❌ Todos error: </span>
            <pre>{JSON.stringify($todosQuery.error, null, 2)}</pre>
          </div>
        </div>
      {/if}

      {#if $todosQuery.isSuccess}
        {#each $todosQuery.data.todos as todo}
          <TodoItem {todo} {onDeleteTodo} on:changeTodo={onChangeTodo} />
        {/each}
      {/if}
    </section>
  </main>
</Navbar>
