import TestWrapper from '@app/TestWrapper.svelte';
import { render, screen } from '@testing-library/svelte';
import Login from './Login.page.svelte';

describe('LoginPage', () => {
  it('should render properly', () => {
    const result = render(TestWrapper, { props: { component: Login } });
    expect(() => result).not.toThrow();
  });

  it('should render login title', () => {
    // ARRANGE
    render(TestWrapper, { props: { component: Login } });
    const linkHome: HTMLAnchorElement = screen.getByRole('link', { name: /home/i });
    const linkRegister: HTMLAnchorElement = screen.getByRole('link', { name: /register/i });
    const imgCover: HTMLImageElement = screen.getByRole('img', { name: /cover/i });

    // ASSERT
    expect(linkHome).toBeInTheDocument();
    expect(linkRegister).toBeInTheDocument();
    expect(imgCover).toBeInTheDocument();
  });
});
