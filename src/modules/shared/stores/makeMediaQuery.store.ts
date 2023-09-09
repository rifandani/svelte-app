/**
 * attaches a MediaQuery listener to window, listening to changes to provided query
 *
 * @param query Media query to listen for
 * @param callback function called every time the media match changes
 * @returns unsubscribe function
 *
 * @example
 * ```ts
 * import { onDestroy } from 'svelte'
 *
 * const unsubscribe = makeMediaQueryListener("(max-width: 767px)", (e) => {
 *    // e.matches
 * });
 *
 * onDestroy(unsubscribe)
 * ```
 */
export function makeMediaQueryListener(
  query: string | MediaQueryList,
  callback: (e: MediaQueryListEvent) => void,
) {
  if (!window) {
    throw new Error('You are not on browser environment!');
  }

  const mql = typeof query === 'string' ? window.matchMedia(query) : query;
  try {
    // Chrome & Firefox
    mql.addEventListener('change', callback);
  } catch (err) {
    try {
      // Safari
      mql.addListener(callback);
    } catch (_err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      console.error('makeMediaQueryListener error =>', { err, _err });
    }
  }

  // return unsubscribe function to remove event listener
  return () => mql.removeEventListener('change', callback);
}
