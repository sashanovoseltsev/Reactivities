import { screen, render } from '@testing-library/react';

import App from './App';

describe('Test for App component', () => {
  test('It renders correctly with person name provided', () => {
    render(<App person={'Sasha'} />);
    const greetingsDiv = screen.getByText(/sasha/i);
    expect(greetingsDiv).toBeInTheDocument();
  })
})