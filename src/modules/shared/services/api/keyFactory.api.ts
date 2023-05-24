import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { authMutationKeys } from '../../../auth/api/auth.api';
import { todoMutationKeys, todoQueryKeys } from '../../../todo/api/todo.api';

export const queryKeyFactory = mergeQueryKeys(todoQueryKeys);
export const mutationKeyFactory = mergeQueryKeys(todoMutationKeys, authMutationKeys);
