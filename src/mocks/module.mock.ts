import type * as svelteRouter from 'svelte-spa-router';
import { vi } from 'vitest';

// mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

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

export const mockedLink = vi.fn();
export const mockedPush = vi.fn();
export const mockedPop = vi.fn();
export const mockedReplace = vi.fn();
export const mockedLoc = vi.fn(() => ({ location: '/todos', querystring: '?limit=10' }));
export const mockedLocation = vi.fn(() => '/todos');
export const mockedQuerystring = vi.fn(() => '?limit=10');
export const mockedParams = vi.fn(() => ({ limit: '10' }));

vi.mock('svelte-spa-router', async () => {
  const actual = await vi.importActual<typeof svelteRouter>('svelte-spa-router');

  return {
    ...actual,
    link: mockedLink,
    push: mockedPush,
    pop: mockedPop,
    replace: mockedReplace,
    loc: mockedLoc,
    location: mockedLocation,
  };
});
