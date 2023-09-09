import { userStoreName } from '@auth/stores/createUserStore.store';
import type { RouteDefinition } from 'svelte-spa-router';
import wrap from 'svelte-spa-router/wrap';

export const todoRoute: RouteDefinition = {
  // exact path, lazy loaded
  '/todos': wrap({
    asyncComponent: () => import('../pages/Todos/Todos.page.svelte'),
    userData: JSON.parse(localStorage.getItem(userStoreName) ?? '{}') as object,
    conditions: [
      () => {
        const user = localStorage.getItem(userStoreName);
        return user !== null && user !== '{}';
      },
    ],
  }),
  '/todos/:id': wrap({
    asyncComponent: () => import('../pages/Todo/Todo.page.svelte'),
    userData: JSON.parse(localStorage.getItem(userStoreName) ?? '{}') as object,
    conditions: [
      () => {
        const user = localStorage.getItem(userStoreName);
        return user !== null && user !== '{}';
      },
    ],
  }),
};
