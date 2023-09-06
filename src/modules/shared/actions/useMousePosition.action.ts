import type { Action } from '@shared/types/action.type';
import { writable, type Writable } from 'svelte/store';

export type MousePosition = [Writable<{ x: number; y: number }>, Action];

/**
 * Get mouse position relative to viewport or given element.
 *
 * @example
 *
 * // const [position, ref] = useMousePosition(true); -> pass `true` to make it relative to document
 * const [position, mousePosition] = useMousePosition();
 * $: ({ x, y } = $position);
 *
 * <Group position="center">
 *   <div use:mousePosition style="width: 300px; height: 100px; background-color: #f1f3f5;" />
 * </Group>
 * <Text align="center">
 *   Mouse coordinates <Code>{`{ x: ${x}, y: ${y} }`}</Code>
 * </Text>
 */
export function useMousePosition(append = false): MousePosition {
  const position = writable({ x: 0, y: 0 });

  const setMousePosition = (event: MouseEvent) => {
    if (append === false) {
      const target = event.currentTarget as Element;
      const rect = target.getBoundingClientRect();

      const x = Math.max(
        0,
        Math.round(event.pageX - rect.left - (window.pageXOffset || window.scrollX)),
      );
      const y = Math.max(
        0,
        Math.round(event.pageY - rect.top - (window.pageYOffset || window.scrollY)),
      );
      position.set({ x, y });
    } else {
      position.set({ x: event.clientX, y: event.clientY });
    }
  };

  const mousePosition = (node: HTMLElement) => {
    const element = !append ? node : document;
    element.addEventListener('mousemove', setMousePosition as EventListenerOrEventListenerObject);

    return {
      destroy: () => {
        element.removeEventListener(
          'mousemove',
          setMousePosition as EventListenerOrEventListenerObject,
        );
      },
    };
  };

  return [position, mousePosition];
}
