import { onMount } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import { defaultWindow, environment } from '../constants/global.constant';

export interface BrowserContextState {
  trigger: string;
  state?: unknown;
  length?: number;
  hash?: string;
  host?: string;
  hostname?: string;
  href?: string;
  origin?: string;
  pathname?: string;
  port?: string;
  protocol?: string;
  search?: string;
}

const listenerOptions = {
  passive: true,
};

/**
 * Get access to the reactive browser location API
 *
 * @example
 *
 * const location = useBrowserContext();
 *
 * $: ({
 *   trigger,
 *   hash,
 *   host,
 *   hostname,
 *   href,
 *   length,
 *   origin,
 *   pathname,
 *   port,
 *   protocol,
 *   search,
 *   state,
 * } = $location);
 */
export function useBrowserContext(): Writable<BrowserContextState> {
  let window: Window;
  if (environment.browser) window = defaultWindow;

  const setState = (trigger: string): BrowserContextState => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { state, length } = window?.history ?? {};
    const { hash, host, hostname, href, origin, pathname, port, protocol, search } =
      window?.location ?? {};

    return {
      trigger,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      state,
      length,
      hash,
      host,
      hostname,
      href,
      origin,
      pathname,
      port,
      protocol,
      search,
    };
  };

  const state: Writable<BrowserContextState> = writable(setState('load'));

  onMount(() => {
    window.addEventListener('popstate', () => state.set(setState('popstate')), listenerOptions);
    window.addEventListener('hashchange', () => state.set(setState('hashchange')), listenerOptions);

    return () => {
      window.removeEventListener('popstate', () => state.set(setState('popstate')));
      window.removeEventListener('hashchange', () => state.set(setState('hashchange')));
    };
  });

  return state;
}
