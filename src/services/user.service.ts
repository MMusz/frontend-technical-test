import { User } from "../types/user.types";
import api from "./api.service";

/**
 * Get a user by their id
 * @param {string} token 
 * @param {string} id 
 * @returns {Promise<User>}
 */
export async function getUserById(token: string, id: string): Promise<User> {
  return await api.get(`/users/${id}`, token);
}

/**
 * Get users by their id
 * @param {string} token 
 * @param {string[]} ids 
 * @returns {Promise<User[]>}
 */
export async function getUsers(token: string, ids: string[]): Promise<User[]> {
  return await api.get(`/users/?ids=${ids.join('&ids=')}`, token);
}