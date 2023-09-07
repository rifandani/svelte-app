import Login from '@auth/pages/Login/Login.page.svelte';
import type { RouteDefinition } from 'svelte-spa-router';
import wrap from 'svelte-spa-router/wrap';

export const authRoute: RouteDefinition = {
  // exact path, lazy loaded
  '/login': wrap({
    component: Login,
    userData: JSON.parse(localStorage.getItem('user') ?? '{}') as object,
    conditions: [
      () => {
        const user = localStorage.getItem('user');
        return user === null || user === '{}';
      },
    ],
  }),
};
