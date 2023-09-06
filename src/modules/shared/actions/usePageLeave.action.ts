import type { Fn } from '@shared/types/action.type';
import type { ActionReturn } from 'svelte/action';

type Callback = Fn<void>;

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
export function pageLeave(
  _node: HTMLElement,
  callback: Callback,
): ActionReturn<Callback, HTMLElement> {
  document.documentElement.addEventListener('mouseleave', callback);

  return {
    destroy() {
      document.documentElement.removeEventListener('mouseleave', callback);
    },
  };
}
