import { deepReadObject } from '@rifandani/nxact-yutiriti';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { setLocale } from '../../../i18n/i18n-svelte';
import type { Locales } from '../../../i18n/i18n-types';
import { loadLocaleAsync } from '../../../i18n/i18n-util.async';
import { loadLocale } from '../../../i18n/i18n-util.sync';

// #region TYPES
interface Clamp {
  value: number;
  min: number;
  max: number;
}
type Arrayable<T> = T[] | T;
export interface GeneralEventListener<E = Event> {
  (evt: E): unknown;
}
// #endregion

/**
 * Provided a string template it will replace dynamics parts in place of variables.
 * This util is largely inspired by [templite](https://github.com/lukeed/templite/blob/master/src/index.js)
 *
 * @param str {string} - The string you wish to use as template
 * @param params {Record<string, string>} - The params to inject into the template
 * @param reg {RegExp} - The RegExp used to find and replace. Default to `/{{(.*?)}}/g`
 *
 * @returns {string} - The fully injected template
 *
 * @example
 * ```ts
 * const txt = template('Hello {{ name }}', { name: 'Tom' });
 * // => 'Hello Tom'
 * ```
 */
export const template = (str: string, params: Record<string, string>, reg = /{{(.*?)}}/g): string =>
  str.replace(reg, (_, key: string) => deepReadObject(params, key, ''));

/**
 * Type Guard for typescript assertions
 *
 * @example
 *
 * ```ts
 * isApiSuccessResponse(postDetail.postDetailData) && ...
 * ```
 */
// export function isApiSuccessResponse<T>(
//   obj: ApiResponse<T> | undefined,
// ): obj is ApiSuccessResponse<T> {
//   return obj ? obj.ok : false;
// }

/**
 * Small wrapper around `clsx` and `twMerge` function.
 * `clsx` is for conditional classes.
 * `twMerge` is for resolving class conflicts and useful when we want to override styles for a component.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp({ value, min, max }: Clamp) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if we are in browser, not server
 */
export const isBrowser = () => typeof window !== 'undefined';

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
 * @param phoneNumber
 */
export const indonesianPhoneNumberFormat = (phoneNumber?: string) => {
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
};

/**
 * convert deep nested object keys to camelCase.
 */
export const toCamelCase = <T>(object: unknown): T => {
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
};

/**
 * convert deep nested object keys to snake_case.
 */
export const toSnakeCase = <T>(object: unknown): T => {
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
};

/**
 * Remove leading zero
 */
export const removeLeadingZeros = (value: string) => {
  if (/^([0]{1,})([1-9]{1,})/i.test(value)) {
    return value.replace(/^(0)/i, '');
  }

  return value.replace(/^[0]{2,}/i, '0');
};

/**
 * Remove leading whitespaces
 */
export const removeLeadingWhitespace = (value?: string) => {
  if (!value) return '';
  if (/^[\s]*$/i.test(value)) {
    return value.replace(/^[\s]*/i, '');
  }

  return value;
};

/**
 * This will works with some rules:
 * 1. If the file source located in the same origin as the application.
 * 2. If the file source is on different location e.g s3 bucket, etc. Set the response headers `Content-Disposition: attachment`.
 * Otherwise it only view on new tab.
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
