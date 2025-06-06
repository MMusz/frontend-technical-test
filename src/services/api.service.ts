import { RequestHeaders, RequestMethod } from "../types/api.types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
  }
}

export class NotFoundError extends Error {
  constructor() {
    super('Not Found');
  }
}

export class BadRequestError extends Error {
  constructor() {
    super('Bad request');
  }
}

function handleResponse(response: Response) {
  if (response.status === 401) {
    throw new UnauthorizedError();
  }
  if (response.status === 404) {
    throw new NotFoundError();
  }
  if (response.status === 400) {
    throw new BadRequestError();
  }
  return response;
}

async function request(method: RequestMethod, url: string, data?: BodyInit, token?: string) {
  const headers: RequestHeaders = data && data instanceof FormData 
    ? {}
    : {'Content-Type': 'application/json'};
    
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const requestOptions: RequestInit = { method, headers };
  if (['POST', 'PUT'].includes(method)) {
    requestOptions.body = data;
  }

  return await fetch(`${BASE_URL}${url}`, requestOptions)
    .then(res => handleResponse(res).json());
}

const api = {
  post: (url: string, data?: BodyInit, token?: string) => request('POST', url, data, token),
  put: (url: string, data?: BodyInit, token?: string) => request('PUT', url, data, token),
  get: (url: string, token?: string) => request('GET', url, undefined, token),
};

export default api;