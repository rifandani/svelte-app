export type Action<T = unknown> = (
  node: HTMLElement,
  parameters?: T,
) => {
  update?: (parameters: T) => unknown | void;
  destroy?: () => void;
};

export interface UnknownKeyString<T> {
  [key: string]: T;
}
export interface UnknownKeyNumber<T> {
  [key: number]: T;
}

export type FocusableElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | HTMLAnchorElement
  | HTMLButtonElement
  | HTMLAreaElement;

export type Fn<T> = () => T;
type Fn2<T, R> = (args: T) => R;

export interface Environment {
  readonly browser?: boolean | Fn2<never, boolean>;
  readonly server?: boolean | Fn2<never, boolean>;
}

const isBrowser = () => typeof window !== 'undefined';

export const ENVIRONMENT: Environment = {
  browser: isBrowser(),
  server: !isBrowser(),
} as const;

export const defaultWindow = ENVIRONMENT.browser ? window : undefined;
