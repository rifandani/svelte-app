# Intro

[![DeepScan grade](https://deepscan.io/api/teams/13942/projects/25053/branches/777069/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=13942&pid=25053&bid=777069)

Svelte template built with:

- `vite` + `typescript` + `eslint` + `prettier` -> dev productivity
- `svelte-spa-router` -> hash based routing
- `vitest` + `@testing-library/svelte` -> unit test, integration test, coverage
- `msw` -> browser and server mocking
- `tailwindcss` + `tailwind-merge` + `daisyui` -> styling
- `@kobalte/core` -> unstyled UI component library (similar to `radix-ui` in React)
- `axios` + `@tanstack/svelte-query` -> data fetching
- `zod` -> schema validation
- `felte` -> form management
- `@iconify/svelte` -> icon on demand
- `type-fest` -> useful type helpers
- `typesafe-i18n` -> typesafe i18n

## Development

```bash
# install deps
$ pnpm install

# init msw for browser mocking
$ pnpm msw:init

# Runs the app
$ pnpm start
```

```bash
# run test
$ pnpm test

# coverage with istanbul
$ pnpm test:coverage
```

## Build

Builds the app for production to the `dist` folder.<br>
It correctly bundles Svelte in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

```bash
# build app
$ pnpm build
```

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)

## Technical considerations (from the vite starter)

**Why use this over SvelteKit?**

- It brings its own routing solution which might not be preferable for some users.
- It is first and foremost a framework that just happens to use Vite under the hood, not a Vite app.

This template contains as little as possible to get started with Vite + TypeScript + Svelte, while taking into account the developer experience with regards to HMR and intellisense. It demonstrates capabilities on par with the other `create-vite` templates and is a good starting point for beginners dipping their toes into a Vite + Svelte project.

Should you later need the extended capabilities and extensibility provided by SvelteKit, the template has been structured similarly to SvelteKit so that it is easy to migrate.

**Why `global.d.ts` instead of `compilerOptions.types` inside `jsconfig.json` or `tsconfig.json`?**

Setting `compilerOptions.types` shuts out all other types not explicitly listed in the configuration. Using triple-slash references keeps the default TypeScript setting of accepting type information from the entire workspace, while also adding `svelte` and `vite/client` type information.

**Why include `.vscode/extensions.json`?**

Other templates indirectly recommend extensions via the README, but this file allows VS Code to prompt the user to install the recommended extension upon opening the project.

**Why enable `allowJs` in the TS template?**

While `allowJs: false` would indeed prevent the use of `.js` files in the project, it does not prevent the use of JavaScript syntax in `.svelte` files. In addition, it would force `checkJs: false`, bringing the worst of both worlds: not being able to guarantee the entire codebase is TypeScript, and also having worse typechecking for the existing JavaScript. In addition, there are valid use cases in which a mixed codebase may be relevant.

**Why is HMR not preserving my local component state?**

HMR state preservation comes with a number of gotchas! It has been disabled by default in both `svelte-hmr` and `@sveltejs/vite-plugin-svelte` due to its often surprising behavior. You can read the details [here](https://github.com/rixo/svelte-hmr#svelte-hmr).

If you have state that's important to retain within a component, consider creating an external store which would not be replaced by HMR.

```ts
// store.ts
// An extremely simple external store
import { writable } from 'svelte/store';
export default writable(0);
```

## NOTES

- [ ] fix all tests -> `typesafe-i18n` always returns empty string,,, `axios` + `svelte-query` + `msw` base url somehow does not works.
- [ ] add `/docs` folder, including all my decisions or technical considerations.
