import type { ActionReturn } from 'svelte/action';

/**
 * Creates `long press` event when mousedown or touchstart is above the `duration` milliseconds.
 *
 * @example
 *
 * ```tsx
 * <script>
 *   import { longPress } from '../useLongPress.action'
 * </script>
 *
 * <button use:longPress={duration} on:uselongPress={() => alert("longPress")}>
 *   press and hold
 * </button>
 * ```
 */
export function longPress(node: HTMLElement, duration: number): ActionReturn<number, HTMLElement> {
  let timer: number;

  function handlePress() {
    timer = window.setTimeout(() => {
      node.dispatchEvent(new CustomEvent('longPress'));
    }, duration);
  }

  function handleRelease() {
    clearTimeout(timer);
  }

  node.addEventListener('mousedown', handlePress);
  node.addEventListener('mouseup', handleRelease);
  node.addEventListener('touchstart', handlePress);
  node.addEventListener('touchend', handleRelease);

  return {
    update(newDuration) {
      handleRelease();
      duration = newDuration;
    },
    destroy() {
      handleRelease();
      node.removeEventListener('touchend', handleRelease);
      node.removeEventListener('touchstart', handlePress);
      node.removeEventListener('mouseup', handleRelease);
      node.removeEventListener('mousedown', handlePress);
    },
  };
}
