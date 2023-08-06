import { onDestroy, onMount } from 'svelte';
import { readonly, writable } from 'svelte/store';

/**
 * Creates a very simple and straightforward media query monitor.
 *
 * @param query Media query to listen for
 * @param fallbackState Server fallback state *(Defaults to `false`)*
 * @returns Writable<Boolean> value if media query is met or not
 *
 * @example
 * ```ts
 * const isSmall = createMediaQuery("(max-width: 767px)");
 *
 * <h1>{$isSmall}</h1>;
 * ```
 */
export function createMediaQuery(query: string, serverFallback = false) {
  if (!window) {
    return writable(serverFallback);
  }

  const mql = window.matchMedia(query);
  const matches = writable(mql.matches);
  const update = () => {
    matches.set(mql.matches);
  };

  onMount(() => {
    mql.addEventListener('change', update);
  });

  onDestroy(() => {
    mql.removeEventListener('change', update);
  });

  return readonly(matches);
}
