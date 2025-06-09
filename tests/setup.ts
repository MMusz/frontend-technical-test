import "@testing-library/jest-dom/vitest";
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

const server = setupServer(...handlers);

if (!('createObjectURL' in URL)) {
  Object.defineProperty(URL, 'createObjectURL', {
    writable: true,
    configurable: true,
    value: vi.fn()
  });
}

if (!('revokeObjectURL' in URL)) {
  Object.defineProperty(URL, 'revokeObjectURL', {
    writable: true,
    configurable: true,
    value: vi.fn()
  });
}

beforeAll(() => {
  server.listen();
  server.events.on('request:start', async ({ request }) => {
    console.log('Outgoing:', request.method, request.url);
  });

  const scrollToMock = vi.fn(() => {});
  vi.stubGlobal('scrollTo', scrollToMock);

  vi.spyOn(globalThis.URL, 'createObjectURL').mockImplementation(() => 'blob:mocked-url');
});
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  server.close();
});