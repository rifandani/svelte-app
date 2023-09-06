import { todoKeys } from '@todo/api/todo.api';
import { derived, type Readable } from 'svelte/store';

export const createTodoDetailParams = (id: Readable<number>) => {
  const enabled = derived(id, ($id) => $id > 0);
  const queryKey = derived(id, ($id) => todoKeys.detail($id));

  return { enabled, queryKey } as const;
};
