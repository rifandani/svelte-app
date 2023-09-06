import { authRoute } from '@auth/routes/auth.route';
import { notFoundRoute } from '@auth/routes/notFound.route';
import { homeRoute } from '@home/routes/home.route';
import { playgroundRoute } from '@playground/routes/playground.route';
import { todoRoute } from '@todo/routes/todo.route';
import type { RouteDefinition } from 'svelte-spa-router';

export const routes: RouteDefinition = {
  ...homeRoute,
  ...todoRoute,
  ...playgroundRoute,
  ...authRoute,
  ...notFoundRoute,
};
