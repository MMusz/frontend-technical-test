import "@testing-library/jest-dom/vitest";
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
  server.events.on('request:start', ({ request }) => {
    console.log('Outgoing:', request.method, request.url)
  });
});
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());