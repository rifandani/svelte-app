import type { RouteDefinition } from 'svelte-spa-router';
import { authRoute } from '../modules/auth/routes/auth.route';
import { homeRoute } from '../modules/home/routes/home.route';
import { sharedRoute } from '../modules/shared/routes/auth.route';
import { todoRoute } from '../modules/todo/routes/todo.route';

export const routes: RouteDefinition = {
  ...homeRoute,
  ...todoRoute,
  ...authRoute,
  ...sharedRoute,
  // Using named parameters, with last being optional
  // '/author/:first/:last?': wrap({
  //   asyncComponent: () => import('./Author.svelte')
  // }),

  // Wildcard parameter
  // '/book/*': Book,
};
