import { tick } from 'svelte';
import type { ActionReturn } from 'svelte/action';

type Target = HTMLElement | string;

/**
 * Render an element or component anywhere in the DOM
 *
 * @example
 *
 * ```tsx
 * <script>
 *   import { portal } from '../usePortal.action'
 * </script>
 *
 * <div use:portal={'css selector'}>
 * <div use:portal={document.body}>
 * ```
 */
export function portal(
  node: HTMLElement,
  target: Target = 'body',
): ActionReturn<Target, HTMLElement> {
  let targetNode: HTMLElement | null;

  function update(newTarget: Target) {
    target = newTarget;

    if (typeof target === 'string') {
      targetNode = document.querySelector(target);
      if (targetNode === null) {
        tick()
          .then(() => (targetNode = document.querySelector(target as string)))
          .catch(() => {
            throw new Error(`tick error`);
          });
      }
      if (targetNode === null) {
        throw new Error(`No element found matching css selector: "${target}"`);
      }
    } else if (target instanceof HTMLElement) {
      targetNode = target;
    } else {
      throw new TypeError(
        `Unknown portal target type: ${
          target === null ? 'null' : typeof target
        }. Allowed types: string (CSS selector) or HTMLElement.`,
      );
    }
    targetNode.appendChild(node);
    node.hidden = false;
  }

  function destroy() {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }

  update(target);

  return {
    update,
    destroy,
  };
}
