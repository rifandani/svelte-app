import { defaultWindow, environment } from '@shared/constants/global.constant';
import { onMount } from 'svelte';
import { writable, type Writable } from 'svelte/store';

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
 * NOTE: using `onMount` inside
 *
 * @example
 *
 * const location = createBrowserContext();
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
export function createBrowserContext(): Writable<BrowserContextState> {
  let window: Window | undefined;
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

  const handlePopStateListener: EventListenerOrEventListenerObject = () => {
    state.set(setState('popstate'));
  };
  const handleHashChangeListener: EventListenerOrEventListenerObject = () => {
    state.set(setState('hashchange'));
  };

  onMount(() => {
    window?.addEventListener('popstate', handlePopStateListener, listenerOptions);
    window?.addEventListener('hashchange', handleHashChangeListener, listenerOptions);

    return () => {
      window?.removeEventListener('popstate', handlePopStateListener);
      window?.removeEventListener('hashchange', handleHashChangeListener);
    };
  });

  return state;
}
