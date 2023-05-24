import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
  expiresInMins: z.number().optional(),
});

export const loginApiResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.union([z.literal('male'), z.literal('female')]),
  image: z.string().url(),
  token: z.string(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type LoginApiResponseSchema = z.infer<typeof loginApiResponseSchema>;
