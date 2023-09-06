import type { ActionReturn } from 'svelte/action';
import { createAriaHider } from './createAriaHider';
import { scopeTab } from './scopeTab';
import { FOCUS_SELECTOR, focusable, tabbable } from './tabbable';

/**
 * the first focusable child gets the focus in the provided affected dom node
 *
 * @example
 *
 * ```tsx
 * <script>
 *   import { focus } from '../useFocusTrap.action'
 * </script>
 *
 * <div use:focusTrap>
 *   <h1>Title</h1>
 *   <input placeholder="Focused" /> <!-- This will be focused -->
 * </div>
 * ```
 */
export function focusTrap(node: HTMLElement, active = true): ActionReturn<boolean, HTMLElement> {
  let restoreAria: (() => void) | null = null;

  function handleKeyDown(event: KeyboardEvent) {
    if (!active) {
      return;
    }

    if (event.key === 'Tab' && node) {
      scopeTab(node, event);
    }
  }

  // since action called only once and don't rerun on params update we have to make a function
  // which we can call on initialization and update
  function activate() {
    if (!active) {
      if (restoreAria) {
        restoreAria();
      }
      return;
    }

    restoreAria = createAriaHider(node);

    const processNode = () => {
      let focusElement: HTMLElement | null = node.querySelector('[autofocus]');

      if (!focusElement) {
        const children = Array.from<HTMLElement>(node.querySelectorAll(FOCUS_SELECTOR));
        focusElement = children.find(tabbable) || children.find(focusable) || null;
        if (!focusElement && focusable(node)) focusElement = node;
      }

      if (focusElement) {
        focusElement.focus({ preventScroll: true });
      } else if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn('[useFocusTrap] Failed to find focusable element within provided node', node);
      }
    };

    // Delay processing the HTML node by a frame. This ensures focus is assigned correctly.
    setTimeout(() => {
      if (node.getRootNode()) {
        processNode();
      } else if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn('[useFocusTrap] node is not part of the dom', node);
      }
    });
  }

  document.addEventListener('keydown', handleKeyDown);
  activate();

  return {
    update(newActive) {
      active = newActive;
      activate();
    },
    destroy() {
      document.removeEventListener('keydown', handleKeyDown);

      if (restoreAria) {
        restoreAria();
      }
    },
  };
}
