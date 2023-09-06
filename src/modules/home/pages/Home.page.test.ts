import TestWrapper from '@shared/components/atoms/TestWrapper.app.svelte';
import { render, screen } from '@testing-library/svelte';
import Home from './Home.page.svelte';

describe('HomePage', () => {
  it('should render properly', () => {
    const result = render(TestWrapper, { props: { component: Home } });
    expect(() => result).not.toThrow();
  });

  it('should render text correctly', () => {
    // ARRANGE
    render(TestWrapper, { props: { component: Home } });
    const heading: HTMLHeadingElement = screen.getByRole('heading', { level: 1 });

    // ASSERT
    expect(heading).toBeInTheDocument();
  });
});
