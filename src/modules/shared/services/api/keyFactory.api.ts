import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { todosMutationKeys, todosQueryKeys } from '../../../todo/api/todos.api';
import { authMutationKeys } from './auth.api';

export const queryKeyFactory = mergeQueryKeys(todosQueryKeys);
export const mutationKeyFactory = mergeQueryKeys(todosMutationKeys, authMutationKeys);
