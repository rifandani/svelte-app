import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { ErrorApiResponseSchema } from '../../shared/api/error.schema';
import { todoApi, todoKeys } from '../api/todo.api';
import type {
  CreateTodoApiResponseSchema,
  CreateTodoSchema,
  TodoListApiResponseSchema,
} from '../api/todo.schema';
import { defaultLimit } from '../pages/Todos/Todos.page.svelte';

type CreateTodoCreateMutationProps = {
  queryKey: ReturnType<typeof todoKeys.list>;
};

export const createTodoCreateMutation = ({ queryKey }: CreateTodoCreateMutationProps) => {
  const queryClient = useQueryClient();

  return createMutation<
    CreateTodoApiResponseSchema,
    ErrorApiResponseSchema,
    CreateTodoSchema,
    { previousTodosQueryResponse: TodoListApiResponseSchema }
  >({
    // Called before `mutationFn`:
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousTodosQueryResponse = (queryClient.getQueryData(queryKey) ??
        []) as TodoListApiResponseSchema;

      // Optimistically update to the new value & delete the last value
      queryClient.setQueryData(queryKey, {
        ...previousTodosQueryResponse,
        todos: [
          newTodo,
          ...previousTodosQueryResponse.todos.slice(
            0,
            Number(queryKey[2]?.limit ?? defaultLimit) - 1,
          ),
        ],
      });

      // Return a context object with the snapshotted value
      return { previousTodosQueryResponse };
    },
    mutationFn: (newTodo) => todoApi.create(newTodo),
  });
};
