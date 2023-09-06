import type { ActionReturn } from 'svelte/action';
import { createStyleTag } from './createStyleTag';
import { getLockStyles } from './getLockStyles';
import { injectStyles } from './injectStyleTag';
import { insertStyleTag } from './insertStyleTag';

interface LockScrollOptions {
  disableBodyPadding: boolean;
}

/**
 * locks scroll at current position by setting `document.body` overflow to hidden.
 *
 * ```tsx
 * <script>
 *   import { lockScroll } from '../useLockScroll.action'
 *
 *   let scrollLocked = false;
 * </script>
 *
 * <div use:lockScroll={scrollLocked}>
 *   <button on:click={() => (scrollLocked = !scrollLocked)}>
 *     {scrollLocked ? 'Unlock scroll' : 'Lock scroll'}
 *   </button>
 * </div>
 * ```
 */
export function lockScroll(
  node: HTMLElement,
  lock?: boolean,
  options: LockScrollOptions = { disableBodyPadding: false },
): ActionReturn<boolean, HTMLElement> {
  let scrollLocked: boolean | undefined = lock ?? false;

  const { disableBodyPadding } = options;

  let stylesheet: HTMLStyleElement | null;

  const lockScroll = () => {
    const styles = getLockStyles({ disableBodyPadding });

    const sheet = createStyleTag();
    injectStyles(sheet, styles);
    insertStyleTag(sheet);

    stylesheet = sheet;
  };

  const unlockScroll = () => {
    if (!stylesheet) return;

    stylesheet?.parentNode?.removeChild(stylesheet);
    stylesheet = null;
  };

  if (scrollLocked) {
    lockScroll();
  } else {
    unlockScroll();
  }

  if (lock !== undefined) {
    scrollLocked = lock;
  }

  if (lock === undefined && typeof window !== 'undefined') {
    window.document.body.style.overflow === 'hidden' && (scrollLocked = lock);
  }

  return {
    update: (locked) => {
      if (locked) {
        lockScroll();
      } else {
        window.document.body.style.overflow === 'visible' && (scrollLocked = lock);
        unlockScroll();
      }
    },
    destroy: () => {
      unlockScroll();
      return;
    },
  };
}
