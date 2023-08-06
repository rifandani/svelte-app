import { render, screen } from '@testing-library/svelte';
import TestWrapper from '../../../shared/components/atoms/TestWrapper.app.svelte';
import Todos from './Todos.page.svelte';

describe('TodosPage', () => {
  it('should render properly', () => {
    const result = render(TestWrapper, { props: { component: Todos } });
    expect(() => result).not.toThrow();
  });

  it('should render content roles correctly', () => {
    // ARRANGE
    render(TestWrapper, { props: { component: Todos } });
    const title = screen.getByRole('heading', { level: 1 });

    // ASSERT
    expect(title).toBeInTheDocument();
  });
});
