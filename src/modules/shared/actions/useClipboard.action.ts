import type { Action } from '../types/action.type';

/**
 * text passed into the text param will be copied to the users clipboard.
 *
 * @example
 *
 * ```tsx
 * <script>
 *   import { clipboard } from '../useClipboard.action'
 * </script>
 *
 * <button use:clipboard={'This text will be copied'}>Copy Me</button>
 * ```
 */
export function clipboard(node: HTMLElement, text: string): ReturnType<Action> {
  const onClick = () => {
    if (text)
      navigator.clipboard
        .writeText(text)
        .then(() => node.dispatchEvent(new CustomEvent('useclipboard', { detail: text })))
        .catch((err) =>
          node.dispatchEvent(new CustomEvent('useclipboardError', { detail: err as Error })),
        );
  };

  node.addEventListener('click', onClick, true);

  return {
    update: (t: string) => (text = t),
    destroy: () => node.removeEventListener('click', onClick, true),
  };
}
