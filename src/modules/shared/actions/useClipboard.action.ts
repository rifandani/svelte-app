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
 *
 * or
 *
 * ```tsx
 *  <button use:clipboard={() => `This text will be copied at ${new Date().toUTCString()}`}>Copy Me</button>
 * ```
 */
export function clipboard(node: HTMLElement, text: string | (() => string)): ReturnType<Action> {
  const onClick = () => {
    const detailText = typeof text === 'function' ? text() : text;

    if (text)
      navigator.clipboard
        .writeText(detailText)
        .then(() => node.dispatchEvent(new CustomEvent('useclipboard', { detail: detailText })))
        .catch((err) =>
          node.dispatchEvent(new CustomEvent('useclipboardError', { detail: err as Error })),
        );
  };

  node.addEventListener('click', onClick, true);

  return {
    update: (t: string | (() => string)) => (text = t),
    destroy: () => node.removeEventListener('click', onClick, true),
  };
}
