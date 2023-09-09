import { onDestroy } from 'svelte';
import { derived, writable, type Writable } from 'svelte/store';
import { createPersisted } from './createPersisted.store';
import { createPrefersDark } from './createPrefersDark.store';

export type BasicColorSchema = BasicColorMode | 'auto';
export type BasicColorMode = 'light' | 'dark';

export interface UseColorModeOptions<T extends string = BasicColorMode> {
  /**
   * CSS Selector for the target element applying to
   *
   * @default 'html'
   */
  selector?: string;

  /**
   * HTML attribute applying the target element
   *
   * @default 'class'
   */
  attribute?: string;

  /**
   * The initial color mode
   *
   * @default 'auto'
   */
  initialValue?: T | BasicColorSchema;

  /**
   * Prefix when adding value to the attribute
   */
  modes?: Partial<Record<T | BasicColorSchema, string>>;

  /**
   * A custom handler for handle the updates.
   * When specified, the default behavior will be overridden.
   *
   * @default undefined
   */
  onChanged?: (
    mode: T | BasicColorMode,
    defaultHandler: (mode: T | BasicColorMode) => void,
  ) => void;

  /**
   * Key to persist the data into localStorage/sessionStorage.
   *
   * Pass `null` to disable persistence
   *
   * @default 'vueuse-color-scheme'
   */
  storageKey?: string | null;

  /**
   * Disable transition on switch
   *
   * @see https://paco.me/writing/disable-theme-transitions
   * @default true
   */
  disableTransition?: boolean;
}

/**
 * Reactive color mode with auto data persistence.
 */
export function createColorMode<T extends string = BasicColorMode>(
  options: UseColorModeOptions<T>,
) {
  const {
    selector = 'html',
    attribute = 'class',
    initialValue = 'auto',
    storageKey = 'app-color-scheme',
    disableTransition = true,
  } = options;

  const modes = {
    auto: '',
    light: 'light',
    dark: 'dark',
    ...(options.modes || {}),
  } as Record<BasicColorSchema | T, string>;

  const store = !storageKey
    ? writable(initialValue)
    : (createPersisted(storageKey, initialValue) as Writable<T>);
  const preferredDark = createPrefersDark();
  const state = derived([store, preferredDark], ([$store, $preferredDark]) =>
    $store === 'auto' ? ($preferredDark ? 'dark' : 'light') : $store,
  );

  const updateHTMLAttrs = (_selector: string, _attribute: string, _value: string) => {
    const el = window.document.querySelector(_selector);
    if (!el) return;

    let style: HTMLStyleElement | undefined;
    if (disableTransition) {
      style = window.document.createElement('style');
      const styleString =
        '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}';
      style.appendChild(document.createTextNode(styleString));
      window.document.head.appendChild(style);
    }

    if (_attribute === 'class') {
      const current = _value.split(/\s/g);
      Object.values(modes)
        .flatMap((i) => (i || '').split(/\s/g))
        .filter(Boolean)
        .forEach((v) => {
          if (current.includes(v)) el.classList.add(v);
          else el.classList.remove(v);
        });
    } else {
      el.setAttribute(_attribute, _value);
    }

    if (disableTransition) {
      // Calling getComputedStyle forces the browser to redraw
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (() => window.getComputedStyle(style!).opacity)();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      document.head.removeChild(style!);
    }
  };

  const unsub = state.subscribe(($state) => {
    if (options.onChanged)
      options.onChanged($state, (mode: T | BasicColorMode) => {
        updateHTMLAttrs(selector, attribute, modes[mode] ?? mode);
      });
    else updateHTMLAttrs(selector, attribute, modes[$state] ?? $state);
  });

  onDestroy(() => unsub());

  return store;
}
