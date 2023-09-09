import { writable, type Writable } from 'svelte/store';

declare type Updater<T> = (value: T) => T;
declare type StoreDict<T> = { [key: string]: Writable<T> };

interface Serializer<T> {
  parse(text: string): T;
  stringify(object: T | null): string;
}

type StorageType = 'local' | 'session';

interface Options<T> {
  serializer?: Serializer<T>;
  storage?: StorageType;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const stores: StoreDict<any> = {};

function getStorage(type: StorageType) {
  return type === 'local' ? localStorage : sessionStorage;
}

/**
 * A Svelte store that persists to local storage. Supports changes across multiple tabs.
 *
 * @param key - local storage unique key
 * @param initialValue - local storage initial value
 * @param options - options to modify searializer or storage type
 *
 * @example
 *
 * ```ts
 * import * as devalue from 'devalue'
 * import { get } from 'svelte/store'
 *
 * const preferences = persisted('local-storage-key', 'default-value', {
 *   serializer: devalue, // defaults to `JSON`
 *   storage: 'session' // 'session' for sessionStorage, defaults to 'local'
 * })
 *
 * preferences.subscribe(...) // subscribe to changes
 * preferences.update(...) // update value
 * preferences.set(...) // set value
 * get(preferences) // read value
 * $preferences // read value with automatic subscription
 * ```
 */
export function createPersisted<T>(
  key: string,
  initialValue: T | null,
  options?: Options<T>,
): Writable<T | null> {
  const serializer = options?.serializer ?? JSON; // defaults to JSON
  const storageType = options?.storage ?? 'local';
  const browser = typeof window !== 'undefined' && typeof document !== 'undefined';
  const storage = browser ? getStorage(storageType) : null;

  function updateStorage(key: string, value: T | null) {
    storage?.setItem(key, serializer.stringify(value));
  }

  if (!stores[key]) {
    const store = writable(initialValue, (set) => {
      const json = storage?.getItem(key);

      if (json) {
        set(<T>serializer.parse(json));
      } else {
        updateStorage(key, initialValue);
      }

      if (browser) {
        const handleStorage = (event: StorageEvent) => {
          if (event.key === key)
            set(event.newValue ? (serializer.parse(event.newValue) as T) : null);
        };

        window.addEventListener('storage', handleStorage);

        return () => window.removeEventListener('storage', handleStorage);
      }
    });

    const { subscribe, set } = store;

    stores[key] = {
      set(value: T) {
        updateStorage(key, value);
        set(value);
      },
      update(callback: Updater<T | null>) {
        return store.update((last) => {
          const value = callback(last);

          updateStorage(key, value);

          return value;
        });
      },
      subscribe,
    };
  }

  return stores[key] as Writable<T>;
}
