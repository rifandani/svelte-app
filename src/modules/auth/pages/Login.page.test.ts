import { render, screen } from '@testing-library/svelte';
import Login from './Login.page.svelte';

describe('LoginPage', () => {
  it('should render login title', () => {
    // ARRANGE
    render(Login);
    const paragraph: HTMLParagraphElement = screen.getByTestId('title');

    // ASSERT
    expect(paragraph).toBeInTheDocument();
  });
});
