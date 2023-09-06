import {
  myCounterEventDecrement,
  myCounterEventIncrement,
  type MyCounterEventDetail,
} from '@lib/wc/MyCounter.constant';
import { SetupWorker } from 'msw';

interface CustomEventMap extends ElementEventMap {
  [typeof myCounterEventDecrement]: CustomEvent<MyCounterEventDetail>;
  [typeof myCounterEventIncrement]: CustomEvent<MyCounterEventDetail>;
}

declare global {
  interface Window {
    msw: {
      worker: SetupWorker;
    };
  }

  interface Element {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Element, ev: CustomEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Element, ev: CustomEventMap[K]) => any,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions,
    ): void;
    // dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
  }
}
