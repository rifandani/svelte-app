import { fireEvent, render, screen } from '@testing-library/svelte';
import { vi } from 'vitest';
import LoginForm from './LoginForm.svelte';

describe('LoginPage', () => {
  const validUsername = 'kminchelle';
  const validPassword = '0lelplR';
  const getItemSpy = vi.spyOn(localStorage, 'getItem');
  localStorage.getItem = vi.fn(() => 'user');

  afterEach(() => {
    getItemSpy.mockClear(); // clear call history
    localStorage.clear();
  });

  it('should login successfully', async () => {
    // ARRANGE
    const { component } = render(LoginForm);
    const iputUsername: HTMLInputElement = screen.getByTestId('input-username');
    const inputPassword: HTMLInputElement = screen.getByTestId('input-password');
    const buttonSubmit: HTMLButtonElement = screen.getByTestId('button-submit');

    // ACT
    await fireEvent.change(iputUsername, { target: { value: validUsername } });
    await fireEvent.change(inputPassword, { target: { value: validPassword } });

    // ASSERT
    expect(iputUsername.value).toBe(validUsername);
    expect(inputPassword.value).toBe(validPassword);

    await fireEvent.click(buttonSubmit);
  });
});
