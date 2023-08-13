import { fireEvent, render, screen } from '@testing-library/svelte';
import { vi } from 'vitest';
import TestWrapper from '../../../shared/components/atoms/TestWrapper.app.svelte';
import HomeClock from './HomeClock.svelte';

describe('HomeClock', () => {
  const mockButtonFn = vi.fn();

  it('should render properly', () => {
    const result = render(TestWrapper, { props: { component: HomeClock } });
    expect(() => result).not.toThrow();
  });

  it('should render clock when toggle clock button clicked', async () => {
    // ARRANGE
    render(TestWrapper, { props: { component: HomeClock } });
    const button: HTMLButtonElement = screen.getByTestId(/home-clock-button-clock/i);

    // ACT & ASSERT
    await fireEvent.click(button);
    expect(screen.queryByTestId('home-clock-show')).toBeInTheDocument();
  });

  // TODO: figure out how to solve this randomness
  it.todo('should shuffle buttons when sort button clicked', async () => {
    // ARRANGE
    render(TestWrapper, { props: { component: HomeClock } });
    const buttonsBefore: HTMLButtonElement[] = screen.queryAllByTestId(/home-clock-button/i);
    const button: HTMLButtonElement = screen.getByTestId(/home-clock-button-sort/i);

    // ACT & ASSERT
    await fireEvent.click(button);
    const buttonsAfter: HTMLButtonElement[] = screen.queryAllByTestId(/home-clock-button/i);
    expect(buttonsBefore[0]).not.toHaveTextContent(buttonsAfter[0].textContent);
    expect(buttonsBefore[1]).not.toHaveTextContent(buttonsAfter[1].textContent);
    expect(buttonsBefore[2]).not.toHaveTextContent(buttonsAfter[2].textContent);
    expect(buttonsBefore[3]).not.toHaveTextContent(buttonsAfter[3].textContent);
  });

  // FIXME: typesafe-i18n always returns empty string
  it.todo('should translate text when change language button clicked', async () => {
    // ARRANGE
    render(TestWrapper, { props: { component: HomeClock } });
    const button: HTMLButtonElement = screen.getByTestId(/home-clock-button-language/i);

    // ACT & ASSERT
    expect(button).toHaveTextContent(/change language/i);
    await fireEvent.click(button);
    expect(button).toHaveTextContent(/ganti bahasa/i);
  });

  it('should call mocked navigate function when get started button clicked', async () => {
    // ARRANGE
    render(TestWrapper, { props: { component: HomeClock } });
    const button: HTMLButtonElement = screen.getByTestId(/home-clock-button-start/i);
    button.addEventListener('click', mockButtonFn);

    // ACT & ASSERT
    await fireEvent.click(button);
    expect(mockButtonFn).toHaveBeenCalled();
  });
});
