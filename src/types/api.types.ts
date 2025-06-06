import { Opt } from "./global.types";

export type RequestMethod = 'GET' | 'POST' | 'PUT';

export type RequestHeaders = {
  'Content-Type'?: string;
  Authorization?: string;
};

export type ApiConfig = {
  API_URL?: Opt<string>;
};
