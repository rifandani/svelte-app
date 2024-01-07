import type { IfEquals } from '@shared/types/helper.type';
import type { Writable } from 'svelte/store';

type ValueSetter<T> = (v: T) => void;
type WithoutNever<T> = Pick<T, { [K in keyof T]: T[K] extends never ? never : K }[keyof T]>;

export type ValueSetters<T> = WithoutNever<{
  // If T[K] is readonly, make it ValueSetterReadonly, otherwise make it ValueSetterPair
  [K in keyof T]?: IfEquals<
    { [Q in K]: T[K] },
    { -readonly [Q in K]: T[K] },
    ValueSetter<T[K]>,
    never
  >;
}>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GetContextReturn<T extends Record<string, any>> = Writable<T>;

export type Defaults<T extends Record<string, unknown>> = {
  [K in keyof T]?: T[K];
};
