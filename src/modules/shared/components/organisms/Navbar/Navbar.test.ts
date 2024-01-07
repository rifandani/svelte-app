import TestWrapper from '@app/TestWrapper.svelte';
import { render, screen } from '@testing-library/svelte';
import Navbar from './Navbar.svelte';

describe('NavBar', () => {
  it('should render properly', () => {
    const result = render(TestWrapper, { props: { component: Navbar } });
    expect(() => result).not.toThrow();
  });

  it('should render role contents correctly', () => {
    // ARRANGE
    render(TestWrapper, { props: { component: Navbar } });
    const link: HTMLAnchorElement = screen.getByRole('link', { name: /logo/i });
    const checkbox: HTMLInputElement = screen.getByRole('checkbox', { name: /drawer/i });

    // ASSERT
    expect(link).toBeInTheDocument();
    expect(checkbox).toBeInTheDocument();
  });
});
