<script context="module">
  // Code contained inside it will run once, when the module first evaluates, rather than when a component is instantiated.
  export const defaultLimit = '10';
  export const limits = ['10', '25', '50', '100'];
</script>

<script lang="ts">
  import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
  import type { ComponentEvents } from 'svelte';
  import { querystring } from 'svelte-spa-router';
  import type { HTMLFormAttributes } from 'svelte/elements';
  import { readable } from 'svelte/store';
  import LL from '../../../i18n/i18n-svelte';
  import type { ErrorApiResponseSchema } from '../../shared/api/error.schema';
  import { LoadingSpinner } from '../../shared/components/atoms';
  import { Navbar } from '../../shared/components/organisms';
  import { mutationKeyFactory, queryKeyFactory } from '../../shared/services/api/keyFactory.api';
  import { createToast } from '../../shared/stores/createToast.store';
  import { deleteTodoById, updateTodoById } from '../api/todo.api';
  import type {
    DeleteTodoApiResponseSchema,
    DeleteTodoSchema,
    TodoListApiResponseSchema,
    UpdateTodoApiResponseSchema,
    UpdateTodoSchema,
  } from '../api/todo.schema';
  import TodoItem from '../components/TodoItem/TodoItem.svelte';
  import TodosCreate from '../components/TodosCreate/TodosCreate.svelte';
  import TodosFilter from '../components/TodosFilter/TodosFilter.svelte';

  //#region VALUES
  $: searchParams = new URLSearchParams(`?${$querystring}`);
  $: queryParams = Object.fromEntries(searchParams);
  $: queryOptions = readable(
    queryKeyFactory.todos.list(
      queryParams && Object.keys(queryParams).length ? queryParams : undefined,
    ),
  );
  $: todosQuery = createQuery($queryOptions);

  const { toaster } = createToast();
  const queryClient = useQueryClient();

  const updateTodoMutation = createMutation<
    UpdateTodoApiResponseSchema,
    ErrorApiResponseSchema,
    UpdateTodoSchema,
    { previousTodosQueryResponse: TodoListApiResponseSchema }
  >({
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

  const deleteTodoMutation = createMutation<
    DeleteTodoApiResponseSchema,
    ErrorApiResponseSchema,
    DeleteTodoSchema['id'],
    { previousTodosQueryResponse: TodoListApiResponseSchema }
  >({
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
  //#endregion

  //#region HANDLERS
  // CustomEvent<TodoSchema>
  const onChangeTodo = (_ev: ComponentEvents<TodoItem>['changeTodo']) => {
    $updateTodoMutation.mutate({ ..._ev.detail, completed: !_ev.detail.completed });
  };

  const onDeleteTodo: HTMLFormAttributes['on:submit'] = (ev) => {
    // parse form data & get todo id from input hidden with name/id `todoId`
    const formData = new FormData(ev.currentTarget);
    const { todoId } = Object.fromEntries(formData.entries());

    $deleteTodoMutation.mutate(Number(todoId));
  };
  //#endregion
</script>

<Navbar>
  <main
    class="flex flex-col items-center justify-center px-10 py-20 duration-300 md:px-24 lg:px-40 xl:px-52"
  >
    <h1
      data-testid="title"
      class="text-primary-content mb-10 text-2xl font-semibold tracking-wider"
    >
      {$LL.common.list('Todo')}
    </h1>

    <section
      class="card bg-secondary text-secondary-content w-full rounded-lg border p-5 shadow-lg"
    >
      <TodosCreate {queryParams} {queryOptions} {todosQuery} />

      <TodosFilter {searchParams} {queryParams} />

      {#if $todosQuery.isLoading || $todosQuery.isFetching}
        <div class="flex items-center justify-center py-5">
          <LoadingSpinner stroke="currentColor" />
        </div>
      {/if}

      {#if $todosQuery.isError}
        <div class="alert alert-error mt-2 shadow-lg">
          <div class="flex items-center">
            <span>{$LL.common.error({ module: 'Todos' })}:</span>
            <pre>{JSON.stringify($todosQuery.error, null, 2)}</pre>
          </div>
        </div>
      {/if}

      {#if $todosQuery.isSuccess}
        {#each $todosQuery.data.todos as todo (todo.id)}
          <TodoItem {todo} {onDeleteTodo} on:changeTodo={onChangeTodo} />
        {/each}
      {/if}
    </section>
  </main>
</Navbar>
