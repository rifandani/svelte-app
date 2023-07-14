import type { RouteDefinition } from 'svelte-spa-router';
import wrap from 'svelte-spa-router/wrap';
import NotFound from '../pages/NotFound/NotFound.page.svelte';

export const notFoundRoute: RouteDefinition = {
  // catch-all, this is optional, but if present it must be the last
  '*': wrap({
    component: NotFound,
  }),
};
