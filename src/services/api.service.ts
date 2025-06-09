import { API_CONFIG } from "../config/api";
import { RequestHeaders, RequestMethod } from "../types/api.types";

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

export class ServerError extends Error {
  constructor() {
    super('Server error');
  }
}

function handleResponse(response: Response) {
  switch (response.status) {
    case 400:
      throw new BadRequestError();
    case 401:
      throw new UnauthorizedError();
    case 404:
      throw new NotFoundError();
    case 500:
      throw new ServerError();
    default:
      if (response.status < 200 || response.status > 299) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response;
  }
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

  return await fetch(`${API_CONFIG.API_URL}${url}`, requestOptions)
    .then(res => handleResponse(res).json());
}

const api = {
  post: (url: string, data?: BodyInit, token?: string) => request('POST', url, data, token),
  put: (url: string, data?: BodyInit, token?: string) => request('PUT', url, data, token),
  get: (url: string, token?: string) => request('GET', url, undefined, token),
};

export default api;