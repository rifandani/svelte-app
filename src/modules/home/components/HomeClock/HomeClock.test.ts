import { render, screen } from '@testing-library/svelte';
import TestWrapper from '../../../../app/TestWrapper.app.svelte';
import HomeClock from './HomeClock.svelte';

describe('HomeClock', () => {
  it('should render properly', () => {
    const result = render(TestWrapper, { props: { component: HomeClock } });
    expect(() => result).not.toThrow();
  });

  it.todo('should render toggle clock correctly', () => {
    // ARRANGE
    render(TestWrapper, { props: { component: HomeClock } });
    const div: HTMLDivElement = screen.getByTestId('show-clock');

    // ASSERT
    expect(div).toBeInTheDocument();
  });

  it.todo('should render buttons correctly', () => {
    // ARRANGE
    render(TestWrapper, { props: { component: HomeClock } });
    const sortBtn: HTMLButtonElement = screen.getByTestId('sort');
    const clockBtn: HTMLButtonElement = screen.getByTestId('clock');
    const languageBtn: HTMLButtonElement = screen.getByTestId('language');
    const startBtn: HTMLButtonElement = screen.getByTestId('start');

    // ASSERT
    expect(sortBtn).toBeInTheDocument();
    expect(clockBtn).toBeInTheDocument();
    expect(languageBtn).toBeInTheDocument();
    expect(startBtn).toBeInTheDocument();
  });
});
