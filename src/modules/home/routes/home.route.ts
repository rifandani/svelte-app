import { userStoreName } from '@auth/stores/createUserStore.store';
import Home from '@home/pages/Home.page.svelte';
import type { RouteDefinition } from 'svelte-spa-router';
import wrap from 'svelte-spa-router/wrap';

export const homeRoute: RouteDefinition = {
  // exact path, eager loaded
  '/': wrap({
    component: Home,
    userData: JSON.parse(localStorage.getItem(userStoreName) ?? '{}') as object,
    conditions: [
      () => {
        const user = localStorage.getItem(userStoreName);
        return user !== null && user !== '{}';
      },
    ],
  }),
};
