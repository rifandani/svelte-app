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
    const iputUsername = screen.getByTestId('input-username') as HTMLInputElement;
    const inputPassword = screen.getByTestId('input-password') as HTMLInputElement;
    const buttonSubmit = screen.getByTestId('button-submit') as HTMLButtonElement;

    // ACT
    await fireEvent.change(iputUsername, { target: { value: validUsername } });
    await fireEvent.change(inputPassword, { target: { value: validPassword } });

    // ASSERT
    expect(iputUsername.value).toBe(validUsername);
    expect(inputPassword.value).toBe(validPassword);

    await fireEvent.click(buttonSubmit);
  });
});
