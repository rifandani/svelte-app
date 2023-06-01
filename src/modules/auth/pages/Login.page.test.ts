import { render, screen } from '@testing-library/svelte';
import { vi } from 'vitest';
import Login from './Login.page.svelte';

describe('LoginPage', () => {
  const getItemSpy = vi.spyOn(localStorage, 'getItem');
  localStorage.getItem = vi.fn(() => 'user');

  afterEach(() => {
    getItemSpy.mockClear(); // clear call history
    localStorage.clear();
  });

  it('should shows proper heading when rendered', () => {
    render(Login);
    const heading = screen.getByTestId('loginHeaderTitle');
    expect(heading).toBeInTheDocument();
  });

  it('should render correctly', async () => {
    // ARRANGE
    // ASSERT
    // await waitFor(() => {
    //   expect(screen.getByText(/Welcome Back/)).toBeInTheDocument();
    //   expect(container.firstChild).toMatchSnapshot();
    // });
  });
});
