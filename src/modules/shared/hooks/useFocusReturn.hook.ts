export interface useFocusReturnResult {
  handleFocusReturn: (opened: boolean, shouldReturnFocus?: boolean) => void;
  returnFocus: () => void;
}

/**
 * Capture last focused element on the page and return focus to it once condition is met
 * Return utilities for focus last active element, useful for Modal and Drawer
 *
 * @example
 *
 * const { handleFocusReturn } = useFocusReturn();
 *
 * let opened = false;
 *
 * // when opened changes to true it will automatically remember last focused element
 * // when opened changes to false it will return focus to last focused element before opening
 * $: handleFocusReturn(opened);
 *
 * @example
 *
 * // if `shouldReturnFocus(second param)` option is set to false you can call `returnFocus` function to focus last active element manually:
 * const { handleFocusReturn, returnFocus } = useFocusReturn();
 *
 * let opened = false;
 *
 * // when opened changes to true it will automatically remember last focused element
 * // when opened changes to false it will do nothing because we set second param as false
 * $: handleFocusReturn(opened, false);
 *
 * function onClose() {
 *   // whenever you call this function it will return focus to last focused element
 *   // which was remembered when handleFocusReturn was called with opened: true
 *   returnFocus();
 * }
 */
export function useFocusReturn(): useFocusReturnResult {
  let lastActiveElement: HTMLElement | undefined;
  const returnFocus = () => {
    if (
      lastActiveElement &&
      'focus' in lastActiveElement &&
      typeof lastActiveElement.focus === 'function'
    ) {
      lastActiveElement.focus({ preventScroll: true });
    }
  };

  return {
    handleFocusReturn(opened, shouldReturnFocus = true) {
      if (opened) {
        lastActiveElement = document.activeElement as HTMLElement;
      } else if (shouldReturnFocus) {
        returnFocus();
      }
    },
    returnFocus,
  };
}
