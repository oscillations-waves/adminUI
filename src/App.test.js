import { render, screen } from '@testing-library/react';
import App from './App';


test('check if table displays', () => {
  // const { getByTestId } = render(<App />);
  // const form = getByTestId('form');
  // const materialUI = getByTestId('material-ui');
  const { container } = render(<App />)
  expect(container.firstChild.classList.contains('App')).toBe(true)
});
