import TestWrapper from '@shared/components/atoms/TestWrapper.app.svelte';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { vi } from 'vitest';
import TodosFilter from './TodosFilter.svelte';

describe('TodosFilter', () => {
  const validLimit = '10';
  const mockChangeFn = vi.fn();

  it('should render properly', () => {
    const result = render(TestWrapper, { component: TodosFilter });
    expect(() => result).not.toThrow();
  });

  it('should render and change limit correctly', async () => {
    // ARRANGE
    render(TestWrapper, { component: TodosFilter });
    const form: HTMLFormElement = screen.getByRole('form');
    const select: HTMLInputElement = screen.getByRole('combobox', { name: /filter/i });
    const options: HTMLOptionElement[] = screen.getAllByRole('option');
    select.addEventListener('select', mockChangeFn);

    // ACT & ASSERT
    expect(form).toBeInTheDocument();
    expect(select).toBeInTheDocument();
    expect(options).toHaveLength(4);
    await fireEvent.select(select, { target: { value: validLimit } });
    expect(select).toHaveValue(validLimit);
    expect(mockChangeFn).toHaveBeenCalled();
  });
});
