import { environment } from '@shared/constants/global.constant';
import { writable, type Writable } from 'svelte/store';

const listenerOptions = {
  passive: true,
};

/**
 * get access to the current with and height of the viewport, and it also subscribes to viewport changes.
 *
 * @example
 *
 * const viewport = createViewportSize();
 *
 * $: ({ width, height } = $viewport);
 */
export function createViewportSize(): Writable<{ width: number; height: number }> {
  const windowSize = writable({
    width: environment.browser ? window.innerWidth : 0,
    height: environment.browser ? window.innerHeight : 0,
  });

  const setSize = () => {
    windowSize.set({
      width: window.innerWidth || 0,
      height: window.innerHeight || 0,
    });
  };

  if (environment.browser) {
    window.addEventListener('resize', setSize, listenerOptions);
    window.addEventListener('orientationchange', setSize, listenerOptions);
  }

  return windowSize;
}
