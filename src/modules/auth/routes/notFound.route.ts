import NotFound from '@auth/pages/NotFound/NotFound.page.svelte';
import type { RouteDefinition } from 'svelte-spa-router';
import wrap from 'svelte-spa-router/wrap';

export const notFoundRoute: RouteDefinition = {
  // catch-all, this is optional, but if present it must be the last
  '*': wrap({
    component: NotFound,
  }),
};
