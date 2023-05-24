import { createMutationKeys, createQueryKeys } from '@lukemorales/query-key-factory';
import type { ResourceParamsSchema } from '../../shared/models/Resource.model';
import { http } from '../../shared/services/api/http.api';
import {
  createPostApiResponseSchema,
  deletePostApiResponseSchema,
  postDetailApiResponseSchema,
  postListApiResponseSchema,
  updatePostApiResponseSchema,
  type CreatePostSchema,
  type DeletePostSchema,
  type PostSchema,
  type UpdatePostSchema,
} from '../models/Post.model';

// #region query functions
export const fetchPostList = async (params: ResourceParamsSchema) => {
  const resp = await http.get('posts', { params });

  // `parse` will throw if `resp.data` is not correct
  return postListApiResponseSchema.parse(resp.data);
};

export const fetchPostDetailById = async (id: PostSchema['id']) => {
  const resp = await http.get(`posts/${id}`);

  // `parse` will throw if `resp.data` is not correct
  return postDetailApiResponseSchema.parse(resp.data);
};

export const createPost = async (post: CreatePostSchema) => {
  const resp = await http.post(`posts/add`, post);

  // `parse` will throw if `resp.data` is not correct
  return createPostApiResponseSchema.parse(resp.data);
};

export const updatePostById = async ({ id, ...body }: UpdatePostSchema) => {
  const resp = await http.put(`posts/${id}`, body);

  // `parse` will throw if `resp.data` is not correct
  return updatePostApiResponseSchema.parse(resp.data);
};

export const deletePostById = async (id: DeletePostSchema['id']) => {
  const resp = await http.delete(`posts/${id}`);

  // `parse` will throw if `resp.data` is not correct
  return deletePostApiResponseSchema.parse(resp.data);
};
// #endregion

// #region keys factory
export const postsQueryKeys = createQueryKeys('posts', {
  list: (params: ResourceParamsSchema = { limit: 10 }) => ({
    queryKey: [params] as const,
    queryFn: () => fetchPostList(params),
  }),
  detailById: (id: PostSchema['id']) => ({
    queryKey: [id],
    queryFn: () => fetchPostDetailById(id),
  }),
});

export const postsMutationKeys = createMutationKeys('posts', {
  create: () => ({
    mutationKey: postsQueryKeys.list._def,
    mutationFn: (params: CreatePostSchema) => createPost(params),
  }),
  updateById: () => ({
    mutationKey: postsQueryKeys.list._def,
    mutationFn: (params: UpdatePostSchema) => updatePostById(params),
  }),
  deleteById: () => ({
    mutationKey: postsQueryKeys.list._def,
    mutationFn: (params: DeletePostSchema['id']) => deletePostById(params),
  }),
});
// #endregion
