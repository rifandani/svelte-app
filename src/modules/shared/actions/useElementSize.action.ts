import { environment } from '@shared/constants/global.constant';
import type { Action } from '@shared/types/action.type';
import { writable, type Writable } from 'svelte/store';

type ObserverRect = Omit<DOMRectReadOnly, 'toJSON'>;

export type ElementSize = [Writable<ObserverRect>, Action];

const defaultState: ObserverRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

/**
 * Get element width and height and subscribe to changes
 *
 * @example
 *
 * const [size, elementSize] = useElementSize();
 * $: ({ width, height } = $size);
 *
 * <textarea use:elementSize style='width: 400px; height: 120;' />
 * <div>Width: {width}px, height: {height}px</div>
 */
export function useElementSize(): ElementSize {
  const size = writable(defaultState);

  const elementSize = (node: HTMLElement) => {
    let frameID = 0;

    const observer = environment.browser
      ? new ResizeObserver((entries) => {
          const entry = entries[0];

          if (entry) {
            cancelAnimationFrame(frameID);

            frameID = requestAnimationFrame(() => {
              size.set(entry.contentRect);
            });
          }
        })
      : null;

    // only run on browser
    if (observer) observer.observe(node);

    return {
      destroy: () => {
        observer?.disconnect();
        cancelAnimationFrame(frameID);
      },
    };
  };

  return [size, elementSize];
}
