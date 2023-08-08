import { derived, type Readable } from 'svelte/store';
import { todoKeys } from '../api/todo.api';

export const createTodoDetailParams = (id: Readable<number>) => {
  const enabled = derived(id, ($id) => $id > 0);
  const queryKey = derived(id, ($id) => todoKeys.detail($id));

  return { enabled, queryKey } as const;
};
