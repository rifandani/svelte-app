import type { Action } from '../types/action.type';

/**
 * prevent current tab from being closed by user.
 *
 * @example
 *
 * ```tsx
 * <script>
 *   import { persistentTab } from '../usePersistentTab.action'
 * </script>
 *
 * <button use:persistentTab={true}>Keep tab open</button>
 * ```
 */
export function persistentTab(_node: HTMLElement, enabled: boolean): ReturnType<Action> {
  function handler(e: BeforeUnloadEvent) {
    e.preventDefault();
    e.returnValue = '';
  }

  function setHandler(prevent: boolean) {
    (prevent ? window.addEventListener : window.removeEventListener)('beforeunload', handler);
  }

  setHandler(enabled);

  return {
    update: setHandler,
    destroy() {
      setHandler(false);
    },
  };
}
