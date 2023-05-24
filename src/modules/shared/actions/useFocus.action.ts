import type { Action, FocusableElement } from '../types/action.type';

/**
 * the affected dom node gets focused when it is mounted into the dom.
 * Only “focusable” elements should use this action.
 * Type errors will appear if this is not the case.
 *
 * @example
 *
 * ```tsx
 * <script>
 *   import { focus } from '../useFocus.action'
 * </script>
 *
 * <input use:focus placeholder="Focused"/>
 * ```
 */
export function focus(node: FocusableElement): ReturnType<Action> | undefined {
  node.focus();

  return;
}
