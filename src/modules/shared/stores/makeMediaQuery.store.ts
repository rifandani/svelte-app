import { onDestroy } from 'svelte';

/**
 * attaches a MediaQuery listener to window, listening to changes to provided query
 * NOTE: using onDestroy inside
 *
 * @param query Media query to listen for
 * @param callback function called every time the media match changes
 *
 * @example
 * makeMediaQueryListener("(max-width: 767px)", e => {
 *    console.log(e.matches)
 * });
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

  // remove event listener `onDestroy` lifecycle hooks
  onDestroy(() => mql.removeEventListener('change', callback));
}
