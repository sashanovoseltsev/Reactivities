import { screen, render, act } from '@testing-library/react';

import axios from 'axios';

import App from './App';

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  get: jest.fn()
}));

describe('Test for App component', () => {
  test('It renders correctly with person name provided', async () => {
    const responsePromise = Promise.resolve({ 
      data: [
        { id: 1, title: 'Act 1'},
        { id: 2, title: 'Act 2'}
      ]
    });
    axios.get.mockReturnValue(responsePromise);

    render(<App />);
    
    await act(() => responsePromise)
    expect(screen.getByText('Act 1')).toBeInTheDocument();
    expect(screen.getByText('Act 2')).toBeInTheDocument();
  })
})