export type Clamp = {
  value: number;
  min: number;
  max: number;
};

export type Arrayable<T> = T[] | T;
export type Stringifiable = string | number | boolean | null | undefined;

export type GeneralEventListener<E = Event> = {
  (evt: E): unknown;
};

// Check if type are equal or just extends
export type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T ? 1 : 2) extends <
  G,
>() => G extends U ? 1 : 2
  ? Y
  : N;

export type Prettify<T> = {
  [K in keyof T]: T[K];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};
