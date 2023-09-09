import Login from '@auth/pages/Login/Login.page.svelte';
import { userStoreName } from '@auth/stores/createUserStore.store';
import type { RouteDefinition } from 'svelte-spa-router';
import wrap from 'svelte-spa-router/wrap';

export const authRoute: RouteDefinition = {
  // exact path, lazy loaded
  '/login': wrap({
    component: Login,
    userData: JSON.parse(localStorage.getItem(userStoreName) ?? '{}') as object,
    conditions: [
      () => {
        const user = localStorage.getItem(userStoreName);
        return user === null || user === '{}';
      },
    ],
  }),
};
