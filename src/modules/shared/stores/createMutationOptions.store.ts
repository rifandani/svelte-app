import type { CreateMutationOptions } from '@tanstack/svelte-query';
import { writable } from 'svelte/store';

/**
 * small wrapper around `writable` for `createMutation` options.
 * mutation options needs to be mutated as svelte store, so that we it will be reactive
 *
 * @example
 *
 * ```ts
 * const mutationOptions = createMutationOptions<LoginApiResponseSchema>({
 *   mutationFn: login({ username }),
 * })
 *
 * const loginMutation = createMutation(mutationOptions)
 * ```
 */
export function createMutationOptions<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(options: CreateMutationOptions<TData, TError, TVariables, TContext>) {
  return writable(options);
}
