import { fireEvent, render, screen } from '@testing-library/svelte';
import { vi } from 'vitest';
import { themes } from '../../../constants/global.constant';
import TestWrapper from '../../atoms/TestWrapper.app.svelte';
import NavBarMenuContent from './NavbarMenuContent.molecule.svelte';

describe('NavBarMenuContent', () => {
  const mockModeBtn = vi.fn();

  it('should render properly', () => {
    const result = render(TestWrapper, { props: { component: NavBarMenuContent } });
    expect(() => result).not.toThrow();
  });

  it('should render role contents correctly', async () => {
    // ARRANGE
    render(TestWrapper, { props: { component: NavBarMenuContent } });
    const link: HTMLAnchorElement = screen.getByRole('link', { name: /todos/i });
    const themeBtn: HTMLButtonElement = screen.getByRole('button', { name: /themes-opener/i });
    const modesBtn: HTMLButtonElement[] = screen.getAllByRole('button', { name: /theme-/i });

    modesBtn[0].addEventListener('click', mockModeBtn);
    await fireEvent.click(modesBtn[0]);

    // ASSERT
    expect(link).toBeInTheDocument();
    expect(themeBtn).toBeInTheDocument();
    expect(modesBtn).toHaveLength(themes.length);
    expect(mockModeBtn).toHaveBeenCalled();
  });
});
