import type { RouteDefinition } from 'svelte-spa-router';
import wrap from 'svelte-spa-router/wrap';
import Home from '../pages/Home.page.svelte';

export const homeRoute: RouteDefinition = {
  // exact path, eager loaded
  '/': wrap({
    component: Home,
    userData: JSON.parse(localStorage.getItem('user')) as object,
    conditions: [
      () => {
        const user = localStorage.getItem('user');
        return user !== null && user !== '{}';
      },
    ],
  }),
};
