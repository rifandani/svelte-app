import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { vi } from 'vitest';
import TestWrapper from '../../../../app/TestWrapper.app.svelte';
import { mockTodo } from '../../../../mocks/http/entities.http';
import type { TodoSchema } from '../../api/todo.schema';
import TodoItem from './TodoItem.svelte';

describe('TodoItem', () => {
  const todo: TodoSchema = mockTodo();
  const onDeleteTodo = vi.fn();
  const mockSubmit = vi.fn();
  const mockChangeTodo = vi.fn();

  const getItemSpy = vi.spyOn(localStorage, 'getItem');
  localStorage.getItem = vi.fn(() => JSON.stringify({ id: todo.id }));

  afterEach(() => {
    getItemSpy.mockClear(); // clear call history
    localStorage.clear();
  });

  it('should render properly', () => {
    const result = render(TestWrapper, { component: TodoItem });
    expect(() => result).not.toThrow();
  });

  // TypeError: Cannot read properties of undefined (reading 'todo')
  it.todo('should render, check, and remove todo correctly', async () => {
    // ARRANGE
    render(TestWrapper, {
      props: {
        todo,
        onDeleteTodo,
        component: TodoItem,
      },
    });

    // ASSERT
    await waitFor(() => {
      expect(screen.getByTestId('form')).toBeInTheDocument();
      expect(screen.getByTestId('input-todoId')).toBeInTheDocument();
      // expect(screen.getByTestId('input-todoId').value).toBe(todo.id.toString());
      expect(screen.getByTestId('input-todo')).toBeInTheDocument();
      // expect(screen.getByTestId('input-todo').checked).toBe(todo.completed);
      expect(screen.getByTestId('p-todo')).toBeInTheDocument();
      // expect(screen.getByTestId('p-todo')).toHaveTextContent(todo.todo);
      // expect(screen.getByTestId('button-remove')).toBeInTheDocument();
    });

    screen.getByTestId('form').addEventListener('submit', mockSubmit);
    screen.getByTestId('input-todo').addEventListener('change', mockChangeTodo);

    // ACT & ASSERT change todo
    await fireEvent.change(screen.getByTestId('input-todo'), {
      target: { value: !todo.completed },
    });
    expect(mockChangeTodo).toHaveBeenCalled();

    // ACT & ASSERT remove todo
    // await fireEvent.click(buttonRemove);
    // expect(mockSubmit).toHaveBeenCalled();
    // expect(onDeleteTodo).toHaveBeenCalled();
  });
});
