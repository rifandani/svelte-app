import {
  writable,
  type Readable,
  type StoresValues,
  type Updater,
  type Writable,
} from 'svelte/store';

/**
 * convert Writable to Readable by referencing to `.subscribe` method
 */
export function toReadable<T>(store: Writable<T>): Readable<T> {
  return { subscribe: store.subscribe };
}

/**
 * writable but with side effects whenever we set the store
 */
export function writableEffect<T>(
  current: T,
  fn: undefined | ((value: T) => unknown),
): Writable<T> {
  const store = writable(current);
  const { subscribe, set } = store;

  const _set = (value: T) => {
    if (value === current) return;

    current = value;
    set(value);
    fn?.(value);
  };

  const _update = (updater: Updater<T>) => {
    _set(updater(current));
  };

  return { subscribe, set: _set, update: _update };
}

/**
 * For melt ui `updateOption` context.
 *
 * @returns option updater function
 */
export function getOptionUpdater(options: Record<string, Writable<unknown>>) {
  return function <
    K extends keyof typeof options,
    V extends StoresValues<(typeof options)[keyof typeof options]>,
  >(key: K, value: V | undefined) {
    if (value === undefined) return;

    const store = options[key];
    store.set(value as never);
  };
}
