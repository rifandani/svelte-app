import type { ActionReturn } from 'svelte/action';

type Text = string | (() => string);

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
export function clipboard(node: HTMLElement, text: Text): ActionReturn<Text, HTMLElement> {
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
    update: (t) => (text = t),
    destroy: () => node.removeEventListener('click', onClick, true),
  };
}
