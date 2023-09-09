import { loginApiResponseSchema, type LoginApiResponseSchema } from '@auth/api/auth.schema';
import { createPersisted } from '@shared/stores/createPersisted.store';
import { get } from 'svelte/store';

export const userStoreName = 'app-user' as const;
const userStoreSchema = loginApiResponseSchema.nullable();

/**
 * save login response as store and sync it with `localStorage`
 *
 * @example
 *
 * ```ts
 * const user = createUserStore()
 *
 * // reset
 * user.set(null)
 * ```
 */
export function createUserStore() {
  const store = createPersisted<LoginApiResponseSchema>(userStoreName, null);
  const value = get(store);
  const parsed = userStoreSchema.safeParse(value);

  // throw error if the 'app-user' value is modified by user
  if (!parsed.success) {
    throw parsed.error;
  }

  return store;
}
