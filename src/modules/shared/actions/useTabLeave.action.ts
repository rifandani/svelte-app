import type { Action } from '../types/action.type';

/**
 * Call a function when the current tab is switched
 *
 * @example
 *
 * ```tsx
 * <script>
 *   import { tabLeave } from '../useTabLeave.action'
 *
 *   $: count = 0;
 * </script>
 *
 * <div use:tableave={() => count++}>Switch the tab to see the counter go up: {count}</div>
 * ```
 */
export function tabLeave(
  _node: HTMLElement,
  callback: Parameters<Document['addEventListener']>[1],
): ReturnType<Action> {
  document.addEventListener('visibilitychange', callback);

  return {
    destroy() {
      document.removeEventListener('visibilitychange', callback);
    },
  };
}
