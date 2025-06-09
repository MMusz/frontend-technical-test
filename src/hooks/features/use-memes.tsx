import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { createMeme, getMemes } from "../../services/meme.service";
import { GetMemesApiResponse, PaginatedMemes, PostMemeApiRequestData } from "../../types/meme.types";
import { User } from "../../types/user.types";
import { getNexPage } from "../../utils/pagination.utils";
import { useAuthProvider } from "./use-providers";
import { useGetUsersFromCacheOrServer } from "./use-users";
import { useApi } from "./use-api";

/**
 * Hook allowing to get memes page by page
 */
export function useGetMemes() {
  const { token } = useAuthProvider();
  const { privateCall } = useApi();
  const { fetchUsers } = useGetUsersFromCacheOrServer();
  
  return useInfiniteQuery<PaginatedMemes>({
    queryKey: ["memes"],
    queryFn: async ({ pageParam = 0 }): Promise<PaginatedMemes>  => {
      const response: GetMemesApiResponse = await privateCall(() => getMemes(token, pageParam as number));
      if (!response.results.length) {
        return response as PaginatedMemes;
      }

      const authorIds: string[] = response.results.map(m => m.authorId)
      const authors: User[] = await fetchUsers(authorIds);

      const formattedRes: PaginatedMemes = {
        ...response,
        results: response.results.map(m => ({
          ...m,
          author: authors.find(a => a.id === m.authorId)
        }))
      };
      
      return formattedRes;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => 
      getNexPage(lastPageParam as number, lastPage.pageSize, lastPage.total)
  });
}

/**
 * Hook allowing to create a new meme
 */
export function usePostMeme() {
  const { token } = useAuthProvider();
  const { privateCall } = useApi();

  return useMutation({
    mutationFn: (data: PostMemeApiRequestData) => {
      return privateCall(() => createMeme(token, data));
    },
  })
}