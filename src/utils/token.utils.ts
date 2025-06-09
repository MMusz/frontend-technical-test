import { jwtDecode } from "jwt-decode";
import { Nullable } from "../types/global.types";

/**
 * Check if a given token has expired
 * @param {Nullable<string>} token 
 * @returns {boolean}
 */
export function isTokenExpired(token: Nullable<string>): boolean {
  if (!token) {
    return true;
  }

  try {
    const { exp } = jwtDecode(token);
    if (!exp) {
      return true;
    }
    return Date.now() >= exp * 1000;
  } catch (error) {
    return true;
  }
}