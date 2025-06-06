import { GetCommentsApiResponse } from "../types/comment.types";
import { GetMemesApiResponse, Meme, PostMemeApiRequestData } from "../types/meme.types";
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

/**
 * Create a meme
 * @param {string} token
 * @param {PostMemeApiRequestData} data
 * @returns {Promise<Meme>}
 */
export async function createMeme(token: string, data: PostMemeApiRequestData): Promise<Meme> {
  const { picture, description, texts } = data;
  const formData = new FormData();
  formData.append('Picture', picture);
  formData.append('Description', description);
  texts.forEach((text, idx) => {
    formData.append(`Texts[${idx}][Content]`, text.content);
    formData.append(`Texts[${idx}][X]`, text.x.toString());
    formData.append(`Texts[${idx}][Y]`, text.y.toString());
  });

  return await api.post(`/memes`, formData, token);
}