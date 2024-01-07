import TestWrapper from '@app/TestWrapper.svelte';
import { render, screen } from '@testing-library/svelte';
import NotFoundPage from './NotFound.page.svelte';

describe('NotFoundPage', () => {
  it('should render properly', () => {
    const result = render(TestWrapper, { props: { component: NotFoundPage } });
    expect(() => result).not.toThrow();
  });

  it('should render text contents correctly', async () => {
    // ARRANGE
    render(TestWrapper, { props: { component: NotFoundPage } });
    const heading: HTMLHeadingElement = await screen.findByRole('heading');
    const anchor: HTMLAnchorElement = await screen.findByRole('link');

    // ASSERT
    expect(heading).toBeInTheDocument();
    expect(anchor).toBeInTheDocument();
  });
});
