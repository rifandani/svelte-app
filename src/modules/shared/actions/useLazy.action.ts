import type { Action } from '../types/action.type';

const nodeAttributesMap = new WeakMap<HTMLElement, object>();

const handleIntersection: IntersectionObserverCallback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.target instanceof HTMLElement) {
      const node = entry.target;
      Object.assign(node, nodeAttributesMap.get(node));
      lazyLoadObserver.unobserve(node);
    }
  });
};

let lazyLoadObserver: IntersectionObserver;

function observer() {
  return (lazyLoadObserver ??= new IntersectionObserver(handleIntersection));
}

/**
 * you can set attributes on an element when it is visible in the viewport.
 *
 * @example
 *
 * ```tsx
 * <script>
 *   import { lazy } from '../useLazy.action'
 * </script>
 *
 * <img use:lazy={{src:"/my-image"}} alt="My Image">
 * ```
 */
export function lazy(
  node: HTMLElement,
  attributes: Record<string, number | string>,
): ReturnType<Action> {
  nodeAttributesMap.set(node, attributes);

  observer().observe(node);

  return {
    destroy() {
      observer().unobserve(node);
    },
  };
}
