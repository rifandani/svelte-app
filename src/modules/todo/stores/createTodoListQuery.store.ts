import type { CreateQueryOptions } from '@tanstack/svelte-query';
import { derived } from 'svelte/store';
import type { ErrorApiResponseSchema } from '../../shared/api/error.schema';
import { todoApi, todoKeys } from '../api/todo.api';
import type { TodoListApiResponseSchema } from '../api/todo.schema';
import { createTodoListReadable } from './createTodoListReadable.store';

export const createTodoListQuery = () => {
  const { queryParams } = createTodoListReadable();

  const queryOptions = derived<
    typeof queryParams,
    CreateQueryOptions<
      TodoListApiResponseSchema,
      ErrorApiResponseSchema,
      TodoListApiResponseSchema,
      ReturnType<typeof todoKeys.list>
    >
  >(queryParams, ($queryParams) => ({
    queryKey: todoKeys.list($queryParams),
    queryFn: () => todoApi.list($queryParams),
  }));

  return { queryOptions } as const;
};
