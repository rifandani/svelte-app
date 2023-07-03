import { environment } from '../constants/global.constant';
import type { ConfigurableWindow, Pauseable } from '../types/action.type';

export interface RafFnOptions extends ConfigurableWindow {
  /**
   * Start the requestAnimationFrame loop immediately on creation
   *
   * @default true
   */
  immediate?: boolean;
}

/**
 * Call function on every `requestAnimationFrame`. With controls of pausing and resuming.
 *
 * @param fn callback function
 * @param options controls whether the callback is triggered immediately
 *
 * @example
 *
 * ```tsx
 * <script>
 * 	let count = 0;
 * 	const { pause, resume } = createRafFn(() => {
 * 		count++
 *     })
 * </script>
 *
 * Count: {count}
 * <button on:click={() => pause()}>Pause</button>
 * <button on:click={() => resume()}>Resume</button>
 * ```
 */
export function createRafFn(fn: () => void, options: RafFnOptions = {}): Pauseable {
  const { immediate = true } = options;
  let isActive = false;

  function loop() {
    if (!isActive) return;

    try {
      fn();

      if (environment.browser) window.requestAnimationFrame(loop);
    } catch (err) {
      console.error(err);
    }
  }

  function resume() {
    if (!isActive) {
      isActive = true;
      loop();
    }
  }

  function pause() {
    isActive = false;
  }

  if (immediate) resume();

  return {
    isActive,
    pause,
    resume,
  };
}
