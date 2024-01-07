import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import { joinKeys, objectEntries } from '../helper/helper.util';
import type { Defaults, GetContextReturn, ValueSetters } from './context.type';

/**
 * always create unique svelte context using Symbol
 */
export function uniqueContext<T>() {
  const key = Symbol();

  return {
    getContext: () => getContext<T>(key),
    setContext: (value: T) => setContext<T>(key, value),
  };
}

/**
 * create reactive svelte context
 */
export function reactiveContext<T extends Record<string, unknown>>(defaults?: Defaults<T>) {
  const initialContext = uniqueContext<GetContextReturn<T>>();

  const setContext = (setters?: ValueSetters<T>) => {
    const keys = joinKeys<keyof T>(defaults ?? {}, setters ?? {});

    const store = writable(
      keys.reduce((acc, key) => {
        if (defaults?.[key] !== undefined) {
          acc[key] = defaults[key] as T[keyof T];
        }

        return acc;
      }, {} as T),
    );

    const update = (updater: (state: T) => Partial<T>) => {
      store.update((prev) => {
        const newState = updater(prev);
        const keys = joinKeys<keyof T>(defaults ?? {}, newState ?? {});
        const withDefaults = keys.reduce((acc, key) => {
          if (newState[key] === undefined && defaults?.[key] !== undefined) {
            acc[key] = defaults[key] as T[keyof T];
          } else {
            acc[key] = newState[key] as T[keyof T];
          }
          return acc;
        }, {} as T);

        objectEntries(withDefaults).forEach(([key, value]) => {
          if (setters) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
            const setter = key in setters ? (setters[key] as any) : undefined;

            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            setter?.(value);
          }
        });

        return withDefaults;
      });
    };

    const set = (v: Partial<T>) => {
      update(() => v);
    };

    const contextStore = {
      ...store,
      set,
      update,
    };

    initialContext.setContext(contextStore);

    return contextStore;
  };

  return { ...initialContext, setContext, defaults };
}

/**
 * Context for registering child components in a parent component.
 * Makes it possible for components to access their child index,
 * and for other components to access the components in the collection.
 */
export function collectionContext() {
  const initialContext = uniqueContext<Writable<Array<HTMLElement>>>();

  const setContext = () => {
    const store = writable<HTMLElement[]>([]);
    initialContext.setContext(store);
    return store;
  };

  return { setContext, getContext: initialContext.getContext };
}
