import { createMediaQuery } from './createMediaQuery.store';

/**
 * Provides a readable indicating if the user has requested dark color theme.
 * The setting is being watched with a [Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme).
 *
 * @param serverFallback value that should be returned on the server — defaults to `false`
 * @returns a boolean readable
 *
 * @example
 * const prefersDark = createPrefersDark();
 */
export function createPrefersDark(serverFallback = false) {
  return createMediaQuery('(prefers-color-scheme: dark)', serverFallback);
}
