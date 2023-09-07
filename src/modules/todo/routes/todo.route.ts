import type { RouteDefinition } from 'svelte-spa-router';
import wrap from 'svelte-spa-router/wrap';

export const todoRoute: RouteDefinition = {
  // exact path, lazy loaded
  '/todos': wrap({
    asyncComponent: () => import('../pages/Todos/Todos.page.svelte'),
    userData: JSON.parse(localStorage.getItem('user') ?? '{}') as object,
    conditions: [
      () => {
        const user = localStorage.getItem('user');
        return user !== null && user !== '{}';
      },
    ],
  }),
  '/todos/:id': wrap({
    asyncComponent: () => import('../pages/Todo/Todo.page.svelte'),
    userData: JSON.parse(localStorage.getItem('user') ?? '{}') as object,
    conditions: [
      () => {
        const user = localStorage.getItem('user');
        return user !== null && user !== '{}';
      },
    ],
  }),
};
