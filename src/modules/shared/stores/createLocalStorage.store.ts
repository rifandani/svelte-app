import { onDestroy } from 'svelte';
import { writable, type Writable } from 'svelte/store';

/**
 * This creates a store that also integrated with local storage.
 * NOTE: using `onDestroy` inside
 *
 * @example
 *
 * ```ts
 * // don't pass second argument to get the already instantiated instance
 * const { store: user } = createLocalStorage('user')
 *
 * <p>{$user}</p>
 * ```
 */
export function createLocalStorage<T>(key: string): {
  store: Writable<T>;
  reset: () => void;
  update: (newValue: T) => void;
};

/**
 * This creates a store that also integrated with local storage.
 * NOTE: using `onDestroy` inside
 *
 * @example
 *
 * ```ts
 * import { onDestroy } from 'svelte';
 *
 * // don't pass second argument to get the already instantiated instance
 * const { store: user } = createLocalStorage('user', { username: 'rifandani' })
 *
 * onDestroy(unsubscribe);
 * ```
 */
export function createLocalStorage<T>(
  key: string,
  initialValue: T,
): {
  store: Writable<T>;
  reset: () => void;
  update: (newValue: T) => void;
};

export function createLocalStorage<T>(key: string, initialValue?: T) {
  // get current data from `localStorage`
  const data = localStorage.getItem(key);

  // if `data` is `null`, set `initialValue` to localStorage
  if (!data && initialValue) localStorage.setItem(key, JSON.stringify(initialValue));

  /**
   * if `data` is exists, parse and save it in writable store, otherwise init a writable store with that `initialValue`
   */
  const store = writable<T>(
    data ? (JSON.parse(data) as T) : initialValue ? initialValue : ({} as T),
  );

  /**
   * reset store state
   */
  const reset = () => {
    store.set({} as T);
  };

  /**
   * update store state
   */
  const update = (newValue: T) => {
    store.update(() => newValue);
  };

  /**
   * subscribe for store changes and sync it with localStorage
   *
   * @returns unsubscribe function. call this on `onDestroy`
   */
  const unsubscribe = store.subscribe((val) => {
    // everytime `store` updated, also update localStorage
    localStorage.setItem(key, JSON.stringify(val));
  });

  // we need to call this function inside of svelte component script tag
  onDestroy(unsubscribe);

  return { store, reset, update };
}
