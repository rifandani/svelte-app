import { QueryClient } from '@tanstack/svelte-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
  logger: {
    log: console.log,
    warn: console.warn,
    error: () => {},
  },
});

// export const renderProviders = (
//   ui: Parameters<typeof render>[0],
//   options?: Parameters<typeof render>[1],
// ) =>
//   render(ui, {
//     wrapper: (props) => <QueryClientProvider client={queryClient}>{props}</QueryClientProvider>,
//     ...options,
//   });

export default {};
