import type { Action } from '@shared/types/action.type';
import { writable, type Writable } from 'svelte/store';

export interface UseFocusWithinOptions {
  onFocus?(event: FocusEvent): void;
  onBlur?(event: FocusEvent): void;
}

type FocusWithin = [Writable<boolean>, Action<UseFocusWithinOptions>];

function containsRelatedTarget(event: FocusEvent) {
  if (event.currentTarget instanceof HTMLElement && event.relatedTarget instanceof HTMLElement) {
    return event.currentTarget.contains(event.relatedTarget);
  }
  return false;
}

/**
 * Detect if any element within has focus.
 *
 * @example
 *
 * const [focused, focusWithin] = useFocusWithin();
 * <Box
 * 	use:focusWithin
 * 	css={{ backgroundColor: $focused ? '$blue50' : 'transparent', padding: '$10' }}
 * >
 * 	<p>
 * 		One of elements has focus: {$focused}
 * 	</p>
 * 	<input type="text" placeholder="Focus this input, styles will be added to parent" />
 * 	<button>Click Me</button>
 * </Box>
 */
export function useFocusWithin({ onBlur, onFocus }: UseFocusWithinOptions = {}): FocusWithin {
  const focused = writable(false);
  let focusedRef = false;

  const setFocused = (value: boolean) => {
    focused.set(value);
    focusedRef = value;
  };

  const handleFocusIn = (event: FocusEvent) => {
    if (!focusedRef) {
      setFocused(true);
      onFocus?.(event);
    }
  };

  const handleFocusOut = (event: FocusEvent) => {
    if (focusedRef && !containsRelatedTarget(event)) {
      setFocused(false);
      onBlur?.(event);
    }
  };

  const focusWithin = (node: HTMLElement) => {
    node?.addEventListener('focusin', handleFocusIn);
    node?.addEventListener('focusout', handleFocusOut);

    return {
      destroy: () => {
        node?.removeEventListener('focusin', handleFocusIn);
        node?.removeEventListener('focusout', handleFocusOut);
      },
    };
  };

  return [focused, focusWithin];
}
