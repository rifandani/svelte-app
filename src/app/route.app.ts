import type { RouteDefinition } from 'svelte-spa-router';
import { authRoute } from '../modules/auth/routes/auth.route';
import { notFoundRoute } from '../modules/auth/routes/notFound.route';
import { homeRoute } from '../modules/home/routes/home.route';
import { playgroundRoute } from '../modules/playground/routes/playground.route';
import { todoRoute } from '../modules/todo/routes/todo.route';

export const routes: RouteDefinition = {
  ...homeRoute,
  ...todoRoute,
  ...playgroundRoute,
  ...authRoute,
  ...notFoundRoute,
};
