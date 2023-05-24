import type { Action } from '../../types/action.type';
import { getHotkeyHandler, getHotkeyMatcher } from './parseHotkey';
export { getHotkeyHandler };

export type HotkeyItem = [string, (event: KeyboardEvent) => void];

function shouldFireEvent(event: KeyboardEvent) {
  if (event.target instanceof HTMLElement) {
    return !['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName);
  }
}

/**
 * Listen for keys combinations on the document element,
 *
 * @example
 *
 * ```tsx
 * <script>
 *   import { hotKey } from '../useHotKey.action'
 * </script>
 *
 *  <div
 * 		use:hotkey={[
 *      ['mod+Enter', () => alert('Command/Ctrl + enter')],
 * 			['shift + 4', toggle()]
 *    ]}
 *  >
 * 		Keybindings added to document element
 *  </div>
 * ```
 *
 * if you need to listen for keybindings on a specific element then you will need to use the `getHotkeyHandler` function instead.
 *
 * @example
 *
 * ```tsx
 * <script>
 *   import { getHotkeyHandler } from '../useHotKey.action'
 *
 *   let value = 'I am using a hotkey to submit';
 *
 *   function onSubmit(val) {
 *	   alert(`Your message says: ${val}`);
 *   }
 * </script>
 *
 *  <input bind:value on:keydown={getHotkeyHandler([['mod+Enter', () => onSubmit(value)]])} type="text" placeholder="Your message" />
 * ```
 */
export function hotKey(node: HTMLElement, hotkeys: HotkeyItem[]): ReturnType<Action> {
  const keyDownListener = (event: KeyboardEvent) => {
    hotkeys.forEach(([hotkey, handler]) => {
      if (getHotkeyMatcher(hotkey)(event) && shouldFireEvent(event)) {
        event.preventDefault();
        handler(event);
      }
    });
  };

  document.documentElement.addEventListener('keydown', keyDownListener);

  return {
    update: (updatedHotKeys: HotkeyItem[]) => {
      hotkeys = updatedHotKeys;
    },
    destroy: () => {
      document.documentElement.removeEventListener('keydown', keyDownListener);
    },
  };
}
