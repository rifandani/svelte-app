import { fireEvent, render, screen } from '@testing-library/svelte';
import { vi } from 'vitest';
import TestWrapper from '../../../shared/components/atoms/TestWrapper.app.svelte';
import HomeClock from './HomeClock.svelte';

describe('HomeClock', () => {
  const mockButtonFn = vi.fn();

  it('should render clock when toggle clock button clicked', async () => {
    // ARRANGE
    render(TestWrapper, { props: { component: HomeClock } });
    const button: HTMLButtonElement = screen.getByTestId(/home-clock-button-clock/i);

    // ACT
    await fireEvent.click(button);

    // ASSERT
    expect(screen.queryByTestId('home-clock-show')).toBeInTheDocument();
  });

  it.todo('should shuffle buttons when sort button clicked', async () => {
    // ARRANGE
    render(TestWrapper, { props: { component: HomeClock } });
    const buttonsBefore: HTMLButtonElement[] = screen.queryAllByTestId(/home-clock-button/i);
    const button: HTMLButtonElement = screen.getByTestId(/home-clock-button-sort/i);

    // ACT
    await fireEvent.click(button);
    const buttonsAfter: HTMLButtonElement[] = screen.queryAllByTestId(/home-clock-button/i);

    // TODO: figure out how to solve this randomness
    // ASSERT
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

    // ASSERT
    expect(button).toHaveTextContent(/change language/i);

    // ACT
    await fireEvent.click(button);

    // ASSERT
    expect(button).toHaveTextContent(/ganti bahasa/i);
  });

  it('should call mocked navigate function when get started button clicked', async () => {
    // ARRANGE
    render(TestWrapper, { props: { component: HomeClock } });
    const button: HTMLButtonElement = screen.getByTestId(/home-clock-button-start/i);
    button.addEventListener('click', mockButtonFn);

    // ACT
    await fireEvent.click(button);

    // ASSERT
    expect(mockButtonFn).toHaveBeenCalled();
  });
});
