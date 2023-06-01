import { render, screen } from '@testing-library/svelte';
import Login from './Login.page.svelte';

describe('LoginPage', () => {
  it('should render login title', () => {
    // ARRANGE
    render(Login);
    const paragraph = screen.getByTestId('title') as HTMLParagraphElement;

    // ASSERT
    expect(paragraph).toBeInTheDocument();
  });
});
