import { setLocale } from '@i18n/i18n-svelte';
import type { Locales } from '@i18n/i18n-types';
import { loadLocaleAsync } from '@i18n/i18n-util.async';
import { loadLocale } from '@i18n/i18n-util.sync';
import { deepReadObject } from '@rifandani/nxact-yutiriti';
import type {
  Arrayable,
  Clamp,
  GeneralEventListener,
  Stringifiable,
} from '@shared/types/helper.type';
import { extendTailwindMerge } from 'tailwind-merge';
import type { ValueOf } from 'type-fest';

/**
 * Provided a string template it will replace dynamics parts in place of variables.
 * This util is largely inspired by [templite](https://github.com/lukeed/templite/blob/master/src/index.js)
 *
 * @param str {string} - The string you wish to use as template
 * @param params {Record<string, string>} - The params to inject into the template
 * @param reg {RegExp} - The RegExp used to find and replace. Default to `/{{(.*?)}}/g`
 * @returns {string} - The fully injected template
 * @category String
 *
 * @example
 * ```ts
 * const txt = template('Hello {{ name }}', { name: 'Tom' });
 * // => 'Hello Tom'
 * ```
 */
export function template(str: string, params: Record<string, string>, reg = /{{(.*?)}}/g): string {
  return str.replace(reg, (_, key: string) => deepReadObject(params, key, ''));
}

/**
 * @category Number
 */
export function clamp({ value, min, max }: Clamp) {
  return Math.min(Math.max(value, min), max);
}

export function addEventListener<E extends keyof WindowEventMap>(
  target: Window,
  event: Arrayable<E>,
  handler: (this: Window, ev: WindowEventMap[E]) => unknown,
  options?: boolean | AddEventListenerOptions,
): VoidFunction;

export function addEventListener<E extends keyof DocumentEventMap>(
  target: Document,
  event: Arrayable<E>,
  handler: (this: Document, ev: DocumentEventMap[E]) => unknown,
  options?: boolean | AddEventListenerOptions,
): VoidFunction;

export function addEventListener<EventType = Event>(
  target: EventTarget,
  event: Arrayable<string>,
  handler: GeneralEventListener<EventType>,
  options?: boolean | AddEventListenerOptions,
): VoidFunction;

/**
 * Adds an event listener to an element, and returns a function to remove it.
 */
export function addEventListener(
  target: Window | Document | EventTarget,
  event: Arrayable<string>,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
) {
  const events = Array.isArray(event) ? [...event] : [event];

  events.forEach((_event) => target.addEventListener(_event, handler, options));
  return () => {
    events.forEach((_event) => target.removeEventListener(_event, handler, options));
  };
}

/**
 * handle changing language synchronously
 */
export function chooseLocaleSync(locale: Locales) {
  // update dictionaries and update formatters
  loadLocale(locale);
  // change locale store
  setLocale(locale);
}

/**
 * handle changing language asynchronously
 */
export async function chooseLocaleAsync(locale: Locales) {
  // update dictionaries and update formatters
  await loadLocaleAsync(locale);
  // change locale store
  setLocale(locale);
}

/**
 * Format phone number based on mockup, currently only covered minimum 11 characters and max 15 characters include +62
 * e.g +62-812-7363-6365
 *
 * @category String
 */
export function indonesianPhoneNumberFormat(phoneNumber?: string) {
  if (!phoneNumber) return '';
  // e.g: +62
  const code = phoneNumber.slice(0, 3);
  const numbers = phoneNumber.slice(3);
  // e.g 812, 852
  const ndc = numbers.slice(0, 3);
  // e.g the rest of the numbers
  const uniqNumber = numbers.slice(3);
  let regexp: RegExp;

  if (uniqNumber.length <= 6) {
    regexp = /(\d{3})(\d{1,})/;
  } else if (uniqNumber.length === 7) {
    regexp = /(\d{3})(\d{4})/;
  } else if (uniqNumber.length === 8) {
    regexp = /(\d{4})(\d{4})/;
  } else {
    regexp = /(\d{4})(\d{5,})/;
  }

  const matches = uniqNumber.replace(regexp, '$1-$2');

  return [code, ndc, matches].join('-');
}

/**
 * convert deep nested object keys to camelCase.
 *
 * @category Object
 */
export function toCamelCase<T>(object: unknown): T {
  let transformedObject = object as Record<string, unknown>;
  if (typeof object === 'object' && object !== null) {
    if (object instanceof Array) {
      transformedObject = object.map(toCamelCase) as unknown as Record<string, unknown>;
    } else {
      transformedObject = {};
      Object.keys(object).forEach((key) => {
        if ((object as Record<string, unknown>)[key] !== undefined) {
          const firstUnderscore = key.replace(/^_/, '');
          const newKey = firstUnderscore.replace(/(_\w)|(-\w)/g, (k) => k[1].toUpperCase());
          transformedObject[newKey] = toCamelCase((object as Record<string, unknown>)[key]);
        }
      });
    }
  }
  return transformedObject as T;
}

/**
 * convert deep nested object keys to snake_case.
 *
 * @category Object
 */
export function toSnakeCase<T>(object: unknown): T {
  let transformedObject = object as Record<string, unknown>;
  if (typeof object === 'object' && object !== null) {
    if (object instanceof Array) {
      transformedObject = object.map(toSnakeCase) as unknown as Record<string, unknown>;
    } else {
      transformedObject = {};
      Object.keys(object).forEach((key) => {
        if ((object as Record<string, unknown>)[key] !== undefined) {
          const newKey = key
            .replace(/\.?([A-Z]+)/g, (_, y) => `_${y ? (y as string).toLowerCase() : ''}`)
            .replace(/^_/, '');
          transformedObject[newKey] = toSnakeCase((object as Record<string, unknown>)[key]);
        }
      });
    }
  }
  return transformedObject as T;
}

/**
 * Remove leading zeros
 *
 * @category String
 */
export function removeLeadingZeros(value: string) {
  if (/^([0]{1,})([1-9]{1,})/i.test(value)) {
    return value.replace(/^(0)/i, '');
  }

  return value.replace(/^[0]{2,}/i, '0');
}

/**
 * Remove leading whitespaces
 *
 * @category String
 */
export function removeLeadingWhitespace(value?: string) {
  if (!value) return '';
  if (/^[\s]*$/i.test(value)) {
    return value.replace(/^[\s]*/i, '');
  }

  return value;
}

/**
 * This will works with some rules:
 * 1. If the file source located in the same origin as the application.
 * 2. If the file source is on different location e.g s3 bucket, etc. Set the response headers `Content-Disposition: attachment`.
 * Otherwise it only view on new tab.
 *
 * @category String
 */
export function doDownload(url: string): void {
  if (!url) return;
  const link = document.createElement('a');
  link.href = url;
  link.download = url;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * create merge function with custom config which extends the default config.
 * Use this if you use the default Tailwind config and just extend it in some places.
 */
export const tw = extendTailwindMerge<'alert'>({
  extend: {
    classGroups: {
      // ↓ The `foo` key here is the class group ID
      //   ↓ Creates group of classes which have conflicting styles
      //     Classes here: 'alert-info', 'alert-success', 'alert-warning', 'alert-error'
      alert: ['alert-info', 'alert-success', 'alert-warning', 'alert-error'],
    },
    // ↓ Here you can define additional conflicts across different groups
    conflictingClassGroups: {
      // ↓ ID of class group which creates a conflict with…
      //     ↓ …classes from groups with these IDs
      // In this case `tw('alert-success alert-error') → 'alert-error'`
      alert: ['alert'],
    },
  },
});

/**
 * create `URLSearchParams` from object query params
 *
 * @category Object
 *
 * @example
 *
 * ```ts
 * createSearchParamsFromObject({ limit: '10', skip: 2 }).toString() // -> 'limit=10&skip=2'
 * createSearchParamsFromObject({ limit: ['10', '20], skip: 2 }).toString() // -> 'limit=10&limit=20&skip=2'
 * ```
 */
export function createSearchParamsFromObject(obj: Record<string, unknown>) {
  return new URLSearchParams(
    Object.entries(obj).flatMap(([key, values]) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      Array.isArray(values) ? values.map((value) => [key, value]) : [[key, values]],
    ),
  );
}

/**
 * omit keys in an object
 *
 * @category Object
 */
export function omit<T extends Record<string, PropertyKey>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  const result = {} as Omit<T, K>;
  for (const key of Object.keys(obj)) {
    if (!keys.includes(key as unknown as K)) {
      result[key as keyof Omit<T, K>] = obj[key] as ValueOf<Omit<T, K>>;
    }
  }
  return result;
}

/**
 * Provides a method with typed keys for Object.keys
 *
 * @category Object
 */
export function objectKeys<O extends object>(object: O) {
  return Object.keys(object) as Array<`${keyof O & Stringifiable}`>;
}

/**
 * Strict typed `Object.entries`
 * Extracted from https://github.com/antfu/utils
 *
 * @category Object
 */
export function objectEntries<T extends object>(obj: T) {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

/**
 * Function that returns an array of keys given multiple objects.
 * The array of keys has no duplicates.
 *
 * @category Object
 */
export function joinKeys<T extends string | number | symbol>(...objects: object[]) {
  return [...new Set(objects.flatMap(Object.keys))] as T[];
}

/**
 * remove undefined values from objects
 *
 * @category Object
 */
export function removeUndefined<T extends object>(obj: T): T {
  const result = {} as T;
  for (const key in obj) {
    const value = obj[key];
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

/**
 * YOLO
 */
export function noop() {
  // do nothing
}

/**
 * map style object to string
 */
export function styleToString(style: Record<string, number | string | undefined>): string {
  return Object.keys(style).reduce((str, key) => {
    if (style[key] === undefined) return str;
    return str + `${key}:${style[key]};`;
  }, '');
}
