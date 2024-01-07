/**
 * UnwrapCustomEvents is a utility type that maps through each property of the given type `T`,
 * and checks if the property type extends CustomEvent. If it does, it extracts the generic type
 * parameter of CustomEvent (i.e., `U`). Otherwise, it keeps the original property type.
 *
 * This type is useful for extracting the details object from CustomEvent types.
 *
 * @template T - The input object type with properties to be mapped and checked.
 */
export type UnwrapCustomEvents<T> = {
  [K in keyof T]: T[K] extends CustomEvent<infer U> ? U : T[K];
};

/**
 * WrapWithCustomEvent is a utility type that maps through each property of the given
 * type `T`, and wraps the property type with CustomEvent, effectively transforming the property
 * type into CustomEvent<T[K]>.
 *
 * This type is useful for wrapping the properties of a type with CustomEvent.
 *
 * @template T - The input object type with properties to be mapped and wrapped.
 */
export type WrapWithCustomEvent<T> = {
  [K in keyof T]: CustomEvent<T[K]>;
};
