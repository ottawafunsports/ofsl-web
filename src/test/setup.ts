import '@testing-library/jest-dom';

// Mock window.location methods
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000/',
    hash: '#/',
    replace: vi.fn(),
    reload: vi.fn(),
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
  },
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
};