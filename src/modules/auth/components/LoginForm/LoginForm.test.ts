import TestWrapper from '@app/TestWrapper.svelte';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { vi } from 'vitest';
import LoginForm from './LoginForm.svelte';

describe('LoginForm', () => {
  const validUsername = 'kminchelle';
  const validPassword = '0lelplR';
  const mockSubmitFn = vi.fn();

  it('should render properly', () => {
    const result = render(TestWrapper, { props: { component: LoginForm } });
    expect(() => result).not.toThrow();
  });

  it('should be able to type the inputs and submit the login form', async () => {
    // ARRANGE
    render(TestWrapper, { props: { component: LoginForm } });
    const formLogin: HTMLFormElement = screen.getByRole('form', { name: /login/i });
    const inputUsername: HTMLInputElement = screen.getByRole('textbox', { name: /username/i });
    const inputPassword: HTMLInputElement = screen.getByRole('textbox', { name: /password/i });
    const buttonSubmit: HTMLButtonElement = screen.getByRole('button');
    formLogin.addEventListener('submit', mockSubmitFn);

    // ACT & ASSERT
    await fireEvent.change(inputUsername, { target: { value: validUsername } });
    await fireEvent.change(inputPassword, { target: { value: validPassword } });
    expect(inputUsername).toHaveValue(validUsername);
    expect(inputPassword).toHaveValue(validPassword);
    await fireEvent.click(buttonSubmit);
    expect(mockSubmitFn).toHaveBeenCalled();
  });
});
