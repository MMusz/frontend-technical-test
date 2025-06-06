import { ApiConfig } from "../types/api.types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/**
 * The API configuration
 */
export const API_CONFIG: ApiConfig = {
  API_URL: BASE_URL, 
} as const;