import { fireEvent, render, screen, type ByRoleOptions } from '@testing-library/svelte';
import { vi } from 'vitest';
import TestWrapper from '../../../shared/components/atoms/TestWrapper.app.svelte';
import TodosCreate from './TodosCreate.svelte';

describe('TodosCreate', () => {
  const todoValue = 'new todo';
  const mockCreateSubmitFn = vi.fn();

  it('should render properly', () => {
    const result = render(TestWrapper, { component: TodosCreate });
    expect(() => result).not.toThrow();
  });

  it('should be able to type the inputs and submit the create todo form', async () => {
    // ARRANGE
    render(TestWrapper, {
      component: TodosCreate,
    });
    const createOptions: ByRoleOptions = { name: /add/i };
    const formCreate: HTMLFormElement = screen.getByRole('form', {});
    const inputTodo: HTMLInputElement = screen.getByRole('textbox', createOptions);
    const buttonSubmit: HTMLButtonElement = screen.getByRole('button', createOptions);

    // ASSERT
    expect(formCreate).toBeInTheDocument();
    expect(inputTodo).toBeInTheDocument();
    expect(buttonSubmit).toBeInTheDocument();

    // ACT
    formCreate.addEventListener('submit', mockCreateSubmitFn);
    await fireEvent.change(inputTodo, { target: { value: todoValue } });

    // ASSERT
    expect(inputTodo).toHaveValue(todoValue);
    await fireEvent.click(buttonSubmit);
    expect(mockCreateSubmitFn).toHaveBeenCalled();
  });
});
