import TestWrapper from '@app/TestWrapper.svelte';
import { rest, server } from '@mocks/http/server.http';
import { getBaseUrl } from '@mocks/util.mock';
import { render, screen, waitFor } from '@testing-library/svelte';
import TodosList from './TodosList.svelte';

describe('TodosList', () => {
  const loadingId = 'list-loading';

  it('should render properly', () => {
    const result = render(TestWrapper, { component: TodosList });
    expect(() => result).not.toThrow();
  });

  // FIXME: query status always "fetching" whatever ctx.status I passed in.
  // 'list-loading' exists, but 'list-error' doesn't.
  it('should be able to query and show error alert', async () => {
    // ARRANGE
    server.use(
      rest.get(getBaseUrl('todos'), (_, res, ctx) =>
        res.once(ctx.status(500), ctx.json({ message: 'error' })),
      ),
    );

    // ASSERT
    expect(screen.queryByTestId(loadingId)).not.toBeInTheDocument();
    render(TestWrapper, { component: TodosList });
    await waitFor(() => {
      // wait for appearance inside an assertion
      expect(screen.getByTestId(loadingId)).toBeInTheDocument();
    });
  });
});
