import { LoginResponse } from "../types/auth.types"
import api from "./api.service"

/**
 * Authenticate the user with the given credentials
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<LoginResponse>}
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
  return await api.post('/authentication/login', JSON.stringify({ username, password }));
}