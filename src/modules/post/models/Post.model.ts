import { z } from 'zod';
import { resourceListSchema } from '../../shared/models/Resource.model';

// #region MODEL SCHEMA
export const postSchema = z.object({
  id: z.number().positive(),
  title: z.string(),
  body: z.string(),
  userId: z.number().positive(),
  tags: z.array(z.string()),
  reactions: z.number().gte(0),
});
export const createPostSchema = postSchema;
export const updatePostSchema = postSchema.omit({ userId: true });
export const deletePostSchema = postSchema.pick({ id: true });
// #endregion

// #region API SCHEMA
export const postListApiResponseSchema = resourceListSchema.extend({
  posts: z.array(postSchema),
});
export const postDetailApiResponseSchema = postSchema;
export const createPostApiResponseSchema = postSchema;
export const updatePostApiResponseSchema = postSchema;
export const deletePostApiResponseSchema = postSchema.extend({
  isDeleted: z.literal(true),
  deletedOn: z.string().datetime(),
});
// #endregion

// #region TYPES
export type PostSchema = z.infer<typeof postSchema>;
export type CreatePostSchema = z.infer<typeof createPostSchema>;
export type UpdatePostSchema = z.infer<typeof updatePostSchema>;
export type DeletePostSchema = z.infer<typeof deletePostSchema>;
export type PostListApiResponseSchema = z.infer<typeof postListApiResponseSchema>;
export type PostDetailApiResponseSchema = z.infer<typeof postDetailApiResponseSchema>;
export type CreatePostApiResponseSchema = z.infer<typeof createPostApiResponseSchema>;
export type UpdatePostApiResponseSchema = z.infer<typeof updatePostApiResponseSchema>;
export type DeletePostApiResponseSchema = z.infer<typeof deletePostApiResponseSchema>;
// #endregion
