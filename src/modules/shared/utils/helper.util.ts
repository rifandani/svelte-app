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
