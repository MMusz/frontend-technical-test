import { GetCommentsApiResponse } from "../types/comment.types";
import { GetMemesApiResponse } from "../types/meme.types";
import api from "./api.service";

/**
 * Get the list of memes for a given page
 * @param {string} token 
 * @param {number} page 
 * @returns {Promise<GetMemesApiResponse>}
 */
export async function getMemes(token: string, page: number): Promise<GetMemesApiResponse> {
  return await api.get(`/memes?page=${page}`, token);
}

/**
 * Get comments for a meme
 * @param {string} token 
 * @param {string} memeId 
 * @param {number} page 
 * @returns {Promise<GetCommentsApiResponse>}
 */
export async function getMemeComments(token: string, memeId: string, page: number): Promise<GetCommentsApiResponse> {
  return await api.get(`/memes/${memeId}/comments?page=${page}`, token);
}

/**
 * Create a comment for a meme
 * @param {string} token
 * @param {string} memeId
 * @param {string} content
 * @returns {Promise<Comment>}
 */
export async function createMemeComment(token: string, memeId: string, content: string): Promise<Comment> {
  return await api.post(`/memes/${memeId}/comments`, JSON.stringify({ content }), token);
}