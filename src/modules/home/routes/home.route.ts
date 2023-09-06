import Home from '@home/pages/Home.page.svelte';
import type { RouteDefinition } from 'svelte-spa-router';
import wrap from 'svelte-spa-router/wrap';

export const homeRoute: RouteDefinition = {
  // exact path, eager loaded
  '/': wrap({
    component: Home,
    userData: JSON.parse(localStorage.getItem('user') ?? '') as object,
    conditions: [
      () => {
        const user = localStorage.getItem('user');
        return user !== null && user !== '{}';
      },
    ],
  }),
};
