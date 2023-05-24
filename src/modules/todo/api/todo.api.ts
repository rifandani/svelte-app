import { createMutationKeys, createQueryKeys } from '@lukemorales/query-key-factory';
import type { ResourceParamsSchema } from '../../shared/models/Resource.model';
import { http } from '../../shared/services/api/http.api';
import {
  createTodoApiResponseSchema,
  deleteTodoApiResponseSchema,
  todoDetailApiResponseSchema,
  todoListApiResponseSchema,
  updateTodoApiResponseSchema,
  type CreateTodoSchema,
  type DeleteTodoSchema,
  type TodoSchema,
  type UpdateTodoSchema,
} from './todo.schema';

// #region query functions
export const fetchTodoList = async (params: ResourceParamsSchema) => {
  const resp = await http.get('todos', { params });

  // `parse` will throw if `resp.data` is not correct
  return todoListApiResponseSchema.parse(resp.data);
};

export const fetchTodoDetailById = async (id: TodoSchema['id']) => {
  const resp = await http.get(`todos/${id}`);

  // `parse` will throw if `resp.data` is not correct
  return todoDetailApiResponseSchema.parse(resp.data);
};

export const createTodo = async (todo: CreateTodoSchema) => {
  const resp = await http.post(`todos/add`, todo);

  // `parse` will throw if `resp.data` is not correct
  return createTodoApiResponseSchema.parse(resp.data);
};

export const updateTodoById = async ({ id, ...body }: UpdateTodoSchema) => {
  const resp = await http.put(`todos/${id}`, body);

  // `parse` will throw if `resp.data` is not correct
  return updateTodoApiResponseSchema.parse(resp.data);
};

export const deleteTodoById = async (id: DeleteTodoSchema['id']) => {
  const resp = await http.delete(`todos/${id}`);

  // `parse` will throw if `resp.data` is not correct
  return deleteTodoApiResponseSchema.parse(resp.data);
};
// #endregion

// #region keys factory
export const todoQueryKeys = createQueryKeys('todos', {
  list: (params: ResourceParamsSchema = { limit: 10 }) => ({
    queryKey: [params] as const,
    queryFn: () => fetchTodoList(params),
  }),
  detailById: (id: TodoSchema['id']) => ({
    queryKey: [id],
    queryFn: () => fetchTodoDetailById(id),
  }),
});

export const todoMutationKeys = createMutationKeys('todos', {
  create: () => ({
    // used for optimistic update, mutation filters
    // see more: https://tanstack.com/query/v5/docs/react/guides/optimistic-updates
    // see more: https://tanstack.com/query/v5/docs/react/guides/filters
    mutationKey: todoQueryKeys.list._def,
    mutationFn: (params: CreateTodoSchema) => createTodo(params),
  }),
  updateById: () => ({
    mutationKey: todoQueryKeys.list._def,
    mutationFn: (params: UpdateTodoSchema) => updateTodoById(params),
  }),
  deleteById: () => ({
    mutationKey: todoQueryKeys.list._def,
    mutationFn: (params: DeleteTodoSchema['id']) => deleteTodoById(params),
  }),
});
// #endregion
