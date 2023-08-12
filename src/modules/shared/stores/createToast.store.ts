import { chain, uid } from '@rifandani/nxact-yutiriti';
import { loop } from 'svelte/internal';
import { derived, get, readable, writable } from 'svelte/store';
import { ESCAPE } from '../constants/global.constant';
import type {
  ActionWithParams,
  PromiseOptions,
  ToastConfig,
  ToastOptions,
  ToastParams,
  ToastReturn,
  Toaster,
  Type,
} from '../types/toast.type';
import { addEventListener } from '../utils/helper.util';

const defaultTimeouts: Record<Type, number> = {
  info: 5000,
  error: 5000,
  success: 2000,
  loading: Infinity,
  custom: 5000,
};

export function getToastDuration(duration: number | undefined, type: Type) {
  return duration ?? defaultTimeouts[type];
}

const runIfFn = <T>(
  v: T | undefined,
  ...a: T extends (...a: unknown[]) => void ? Parameters<T> : never
): T extends (...a: unknown[]) => void ? NonNullable<ReturnType<T>> : NonNullable<T> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const res = typeof v === 'function' ? v(...a) : v;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res ?? undefined;
};

const msTime$ = readable(Date.now(), (set) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const task = loop(() => {
    set(Date.now());
    return true;
  });

  // eslint-disable-next-line @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return task.abort;
});

const normalizeOptions = (options: ToastOptions): ToastParams => {
  const { id = uid(20, 'toast'), type = 'info', duration, ...rest } = options;
  const _duration = getToastDuration(duration, type);

  return {
    id,
    type,
    state: 'active',
    duration: _duration,
    createdAt: Date.now(),
    remaining: _duration,
    ...rest,
  };
};

const toasts$ = writable<ToastParams[]>([]);

/**
 * Use to give feedback & confirmation to users after they take an action.
 */
export function createToast(initConfig?: ToastConfig): ToastReturn {
  const {
    max = Number.MAX_SAFE_INTEGER,
    pauseOnInteraction = true,
    pauseOnPageIdle = false,
  } = initConfig || {};

  const toaster: Toaster = {
    create(options: ToastOptions) {
      const params = normalizeOptions(options);
      if (toaster.find(params.id)) return;
      toasts$.update((toasts) =>
        toasts.length === max ? [...toasts.slice(1), params] : [...toasts, params],
      );
      return params.id;
    },
    find(id?: string) {
      return get(toasts$).find((toast) => toast.id === id);
    },
    update(id: string, options: ToastOptions) {
      if (!toaster.find(id)) return;
      toasts$.update((toasts) =>
        toasts.map((toast) => (toast.id === id ? normalizeOptions({ id, ...options }) : toast)),
      );
      options.onUpdate?.();
      return id;
    },
    upsert(options: ToastOptions) {
      const { id } = options;
      return id && toaster.find(id) ? toaster.update(id, options) : toaster.create(options);
    },
    dismiss(id?: string) {
      toasts$.update((toasts) =>
        toasts.filter((toast) => {
          if (!id || toast.id === id) {
            toast.onClose?.();
            return false;
          }
          return true;
        }),
      );
    },
    pause(id?: string) {
      toasts$.update((toasts) =>
        toasts.map((toast) =>
          (!id || toast.id === id) && toast.state !== 'paused'
            ? {
                ...toast,
                remaining: toast.remaining - Date.now() + toast.createdAt,
                state: 'paused',
              }
            : toast,
        ),
      );
    },
    resume(id?: string) {
      toasts$.update((toasts) =>
        toasts.map((toast) =>
          (!id || toast.id === id) && toast.state !== 'active'
            ? { ...toast, createdAt: Date.now(), state: 'active' }
            : toast,
        ),
      );
    },
    loading(options: ToastOptions) {
      return toaster.upsert({ ...options, type: 'loading' });
    },
    success(options: ToastOptions) {
      return toaster.upsert({ ...options, type: 'success' });
    },
    error(options: ToastOptions) {
      return toaster.upsert({ ...options, type: 'error' });
    },
    promise<T>(promise: Promise<T>, options: PromiseOptions<T>, shared: ToastOptions = {}) {
      const id = toaster.loading({ ...shared, ...options.loading });

      promise
        .then((response) => {
          const successOptions = runIfFn(options.success, response);
          toaster.success({ ...shared, ...successOptions, id });
        })
        .catch((error) => {
          const errorOptions = runIfFn(options.error, error as Error);
          toaster.error({ ...shared, ...errorOptions, id });
        });

      return promise;
    },
  };

  const progress$ = derived(msTime$, (now) => (toast: ToastParams) => {
    const { state, createdAt, remaining, duration } = toast;
    return state === 'active' ? now - createdAt + duration - remaining : duration - remaining;
  });

  const useToast: ActionWithParams<HTMLElement, ToastParams> = (node, initParams) => {
    const params$ = writable(initParams);

    function dismiss() {
      toaster.dismiss(get(params$).id);
    }

    function pause() {
      toaster.pause(get(params$).id);
    }

    function resume() {
      toaster.resume(get(params$).id);
    }

    const unsubscribe = derived(
      [progress$, params$],
      ([progress, params]) => [progress(params), params] as const,
    ).subscribe(([progress, { id, duration }]) => {
      if (progress >= duration) {
        toaster.dismiss(id);
      }
    });

    const removeEvents = chain(
      ...(pauseOnInteraction
        ? [
            addEventListener(node, `keydown`, (e: KeyboardEvent) => {
              if (!e.defaultPrevented && e.key === ESCAPE) {
                dismiss();
              }
            }),
            addEventListener(node, ['focus', 'pointerenter'], pause),
            addEventListener(node, ['blur', 'pointerleave'], resume),
          ]
        : []),
      ...(pauseOnPageIdle
        ? [addEventListener(window, 'focus', resume), addEventListener(window, 'blur', pause)]
        : []),
    );

    return {
      update(newParams) {
        params$.update((params) => ({ ...params, ...newParams }));
      },
      destroy() {
        removeEvents();
        unsubscribe?.();
      },
    };
  };

  const groupAttrs = readable({
    id: uid(20, 'toast-group'),
    'aria-live': 'polite',
    role: 'region',
  });

  const rootAttrs = derived(toasts$, (toasts: ToastParams[]) => (toast: ToastParams) => ({
    id: toast.id,
    'data-state': toast.state,
    'data-open': toasts.find(({ id }) => id === toast.id) ? 'true' : 'false',
    'data-type': toast.type,
    role: 'status',
    'aria-atomic': 'true',
    tabindex: '0',
  }));

  return {
    toasts: { subscribe: toasts$.subscribe },
    toaster,
    useToast,
    groupAttrs,
    rootAttrs,
    progress: progress$,
  };
}
