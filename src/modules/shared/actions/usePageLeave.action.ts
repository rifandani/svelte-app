import type { Action, Fn } from '../types/action.type';

/**
 * Call a function when the mouse leaves the page
 *
 * @example
 *
 * ```tsx
 * <script>
 *   import { pageLeave } from '../usePageLeave.action'
 *
 *   $: count = 0;
 * </script>
 *
 * <div use:pageleave={() => count++}>Move the mouse off the page to see the counter go up: {count}</div>
 * ```
 */
export function pageLeave(_node: HTMLElement, callback: Fn<void>): ReturnType<Action> {
  document.documentElement.addEventListener('mouseleave', callback);

  return {
    destroy() {
      document.documentElement.removeEventListener('mouseleave', callback);
    },
  };
}
