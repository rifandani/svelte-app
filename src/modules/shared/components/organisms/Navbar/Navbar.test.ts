import { render, screen } from '@testing-library/svelte';
import TestWrapper from '../../atoms/TestWrapper.app.svelte';
import NavBar from './Navbar.organism.svelte';

describe('NavBar', () => {
  it('should render properly', () => {
    const result = render(TestWrapper, { props: { component: NavBar } });
    expect(() => result).not.toThrow();
  });

  it('should render role contents correctly', () => {
    // ARRANGE
    render(TestWrapper, { props: { component: NavBar } });
    const link: HTMLAnchorElement = screen.getByRole('link', { name: /logo/i });
    const checkbox: HTMLInputElement = screen.getByRole('checkbox', { name: /drawer/i });

    // ASSERT
    expect(link).toBeInTheDocument();
    expect(checkbox).toBeInTheDocument();
  });
});
