import { writable, type Writable } from 'svelte/store';
import { defaultWindow, environment } from '../constants/global.constant';

export interface EyeDropperOpenOptions {
  signal?: AbortSignal;
}

export interface EyeDropper {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (): EyeDropper;
  open: (options?: EyeDropperOpenOptions) => Promise<{ sRGBHex: string }>;
  [Symbol.toStringTag]: 'EyeDropper';
}

export interface EyeDropperOptions {
  initialValue?: string;
}

export interface EyeDropperReturn {
  isSupported: boolean;
  sRGBHex: Writable<string>;
  open: (openOptions?: EyeDropperOpenOptions) => Promise<{ sRGBHex: string } | undefined>;
}

/**
 * A reactive [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API)
 *
 * @param options - an object containing the initial value of the sRGBHex value
 *
 * @example
 *
 * const { isSupported, sRGBHex, open } = createEyeDropper({ initialValue: '#000000' });
 *
 * <Text>isSupported: {isSupported}</Text>
 * <Text>
 *   sRGBHex: <Text inherit override={{ color: `${$sRGBHex} !important` }}>{$sRGBHex}</Text>
 * </Text>
 * <Button variant="outline" on:click={() => open()}>
 *   Open Eye Dropper
 * </Button>
 */
export function createEyeDropper(options: EyeDropperOptions = {}): EyeDropperReturn {
  let window: Window | undefined;
  if (environment.browser) window = defaultWindow;

  const { initialValue = '' }: EyeDropperOptions = options;
  const isSupported = Boolean(typeof window !== 'undefined' && 'EyeDropper' in window);
  const sRGBHex = writable(initialValue);

  async function open(openOptions?: EyeDropperOpenOptions) {
    if (!isSupported) return;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    const eyeDropper: EyeDropper = new (window as any).EyeDropper();
    const res = await eyeDropper.open(openOptions);
    sRGBHex.set(res.sRGBHex);
    return res;
  }

  return {
    isSupported,
    sRGBHex,
    open,
  };
}
