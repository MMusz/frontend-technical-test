import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { createMemeComment, getMemeComments } from "../../services/meme.service";
import { GetCommentsApiResponse, PaginatedComments } from "../../types/comment.types";
import { Nullable } from "../../types/global.types";
import { getNexPage } from "../../utils/pagination.utils";
import { useAuthProvider } from "./use-providers";
import { useGetUsersFromCacheOrServer } from "./use-users";

/**
 * Hook allowing to get meme's comments page by page
 */
export function useGetMemeComments(memeId: Nullable<string>) {
  const { token } = useAuthProvider();
  const { fetchUsers } = useGetUsersFromCacheOrServer();

  return useInfiniteQuery<PaginatedComments>({
    enabled: !!memeId,
    queryKey: ["comments", { memeId }],
    queryFn: async ({ pageParam = 0 }): Promise<PaginatedComments>  => {
      if (!memeId) {
        throw new Error('Meme ID is required to retrieve meme\'s comments');
      }

      const response: GetCommentsApiResponse = await getMemeComments(token, memeId, pageParam as number);
      if (!response.results.length) {
        return response as PaginatedComments;
      }

      const authorIds: string[] = response.results.map(m => m.authorId);
      const authors = await fetchUsers(authorIds);

      const formattedRes: PaginatedComments = {
        ...response,
        results: response.results.map(c => ({
          ...c,
          author: authors.find(a => a.id === c.authorId)
        }))
      };

      return formattedRes;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => 
      getNexPage(lastPageParam as number, lastPage.pageSize, lastPage.total),
  });
}

/**
 * Hook allowing to post a new comment on a specific meme
 */
export function usePostComment() {
  const { token } = useAuthProvider();

  return useMutation({
    mutationFn: async (data: { memeId: string; content: string }) => {
      await createMemeComment(token, data.memeId, data.content);
    },
  });
}
