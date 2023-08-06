import type * as svelteRouterActive from 'svelte-spa-router/active';
import { vi } from 'vitest';

// mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// mock window matchMedia
window.matchMedia = function matchMedia(query) {
  return {
    media: query,
    matches: false,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
};

// implementation of window.resizeTo for dispatching event
window.resizeTo = function resizeTo(width, height) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  Object.assign(this, {
    innerWidth: width,
    innerHeight: height,
    outerWidth: width,
    outerHeight: height,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  }).dispatchEvent(new this.Event('resize'));
};

// const mockedRouter = vi.hoisted(() => {
//   return {
//     link: vi.fn(),
//     push: vi.fn(),
//     pop: vi.fn(),
//     replace: vi.fn(),
//     loc: vi.fn(() => ({ location: '/todos', querystring: '?limit=10' })),
//     location: vi.fn(() => '/todos'),
//     querystring: vi.fn(() => '?limit=10'),
//     params: vi.fn(() => ({ limit: '10' })),
//   };
// });

const mockedRouterActive = vi.hoisted(() => {
  return {
    default: vi.fn(),
    loc: vi.fn(() => ({ location: '/todos', querystring: '?limit=10' })),
  };
});

// vi.mock('svelte-spa-router', async () => {
//   const actual = await vi.importActual<typeof svelteRouter>('svelte-spa-router');

//   return {
//     ...actual,
//     link: mockedRouter.link,
//     push: mockedRouter.push,
//     pop: mockedRouter.pop,
//     replace: mockedRouter.replace,
//     loc: mockedRouter.loc,
//     location: mockedRouter.location,
//   };
// });

vi.mock('svelte-spa-router/active', async (module) => {
  const actual: typeof svelteRouterActive = await module();

  return {
    ...actual,
    loc: mockedRouterActive.loc,
  };
});

vi.mock('typesafe-i18n', () => ({
  LL: vi.fn(),
}));
