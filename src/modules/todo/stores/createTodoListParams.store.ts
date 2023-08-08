import { querystring } from 'svelte-spa-router';
import { derived } from 'svelte/store';
import type { ResourceParamsSchema } from '../../shared/api/resource.schema';
import { todoKeys } from '../api/todo.api';
import { defaultLimit } from '../pages/Todos/Todos.page.svelte';

export const createTodoListParams = () => {
  const searchParams = derived(
    querystring,
    ($querystring) => new URLSearchParams(`?${$querystring}`),
  );

  const queryParams = derived<typeof searchParams, ResourceParamsSchema>(
    searchParams,
    ($searchParams) => {
      const params = Object.fromEntries($searchParams);

      return {
        ...params,
        limit: Number(params.limit ?? defaultLimit),
      };
    },
  );

  const queryKey = derived(queryParams, ($queryParams) => todoKeys.list($queryParams));

  return { searchParams, queryParams, queryKey } as const;
};
