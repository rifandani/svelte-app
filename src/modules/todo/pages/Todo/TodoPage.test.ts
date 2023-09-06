import TestWrapper from '@shared/components/atoms/TestWrapper.app.svelte';
import { render, screen } from '@testing-library/svelte';
import TodoPage from './Todo.page.svelte';

describe('TodoPage', () => {
  it('should render properly', () => {
    const result = render(TestWrapper, { props: { component: TodoPage } });
    expect(() => result).not.toThrow();
  });

  it('should render role contents correctly', () => {
    // ARRANGE
    render(TestWrapper, { props: { component: TodoPage } });
    const link: HTMLAnchorElement = screen.getByRole('link', { name: /go-back/i });
    const title: HTMLHeadingElement = screen.getByRole('heading', { level: 1 });

    // ASSERT
    expect(link).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });
});
