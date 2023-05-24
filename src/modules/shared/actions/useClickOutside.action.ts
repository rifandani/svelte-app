import type { Action } from '../types/action.type';

/**
 * a callback function will be fired whenever the user clicks outside of the dom node the action is applied to.
 *
 * @example
 *
 * ```tsx
 * <script>
 *   import { clickOutside } from '../useClickOutside.action'
 *
 *   let open = true;
 * </script>
 *
 * <div use:clickOutside={{ enabled: open, callback: () => open = false }}>
 *   <button on:click={() => open = true}>Open Modal</button>
 *
 *   {#if open}
 *     <div>This is a modal</div>
 *   {:else if !open}
 *     <div>There is no modal</div>
 *   {/if}
 * </div>
 * ```
 */
export function clickOutside(
  node: HTMLElement,
  params: { enabled: boolean; callback: (node: HTMLElement) => unknown },
): ReturnType<Action> {
  const { enabled: initialEnabled, callback } = params;

  const handleClickOutside = ({ target }: MouseEvent) => {
    if (!node.contains(target as Node)) callback(node);
  };

  function update({ enabled }: { enabled: boolean }) {
    if (enabled) {
      window.addEventListener('click', handleClickOutside);
    } else {
      window.removeEventListener('click', handleClickOutside);
    }
  }
  update({ enabled: initialEnabled });

  return {
    update,
    destroy() {
      window.removeEventListener('click', handleClickOutside);
    },
  };
}
