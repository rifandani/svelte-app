import { render, screen } from '@testing-library/svelte';
import TestWrapper from '../../../app/TestWrapper.app.svelte';
import Login from './Login.page.svelte';

describe('LoginPage', () => {
  it('should render login title', () => {
    // ARRANGE
    render(TestWrapper, { props: { component: Login } });
    const paragraph: HTMLParagraphElement = screen.getByTestId('title');

    // ASSERT
    expect(paragraph).toBeInTheDocument();
  });
});
