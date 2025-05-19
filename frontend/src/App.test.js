import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => children,
  Route: ({ children }) => children,
  Navigate: () => null,
  useNavigate: () => jest.fn(),
}));

test('renders app without crashing', () => {
  render(<App />);
});
