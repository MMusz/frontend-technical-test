import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { createMemeComment, getMemeComments } from "../../services/meme.service";
import { GetCommentsApiResponse, PaginatedComments } from "../../types/comment.types";
import { DataQueryPages, Nullable } from "../../types/global.types";
import { getNexPage } from "../../utils/pagination.utils";
import { useAuthProvider, useProviders } from "./use-providers";
import { useGetUsersFromCacheOrServer } from "./use-users";
import { PaginatedMemes } from "../../types/meme.types";

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
  const { queryClient, token, id: authorId } = useProviders();
  const { fetchUsers } = useGetUsersFromCacheOrServer();

  return useMutation({
    mutationFn: async (data: { memeId: string; content: string }) => {
      const { memeId, content } = data;
      const comment: Comment = await createMemeComment(token, memeId, content);

      const authors = await fetchUsers([authorId]);

      await queryClient.cancelQueries({ queryKey: ['comments', { memeId }] });
      queryClient.setQueryData(['comments', { memeId }], (oldData: DataQueryPages<PaginatedComments>) => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            results: [
              {
                ...comment,
                author: authors.find(a => a.id === authorId)
              },
              ...page.results,
            ]
          }))
        }
      })
    },
    onMutate: async (data: { memeId: string; content: string }) => {
      const { memeId } = data;
      await queryClient.cancelQueries({ queryKey: ['memes'] });
      const previousMemes = queryClient.getQueryData(['memes']);
      queryClient.setQueryData(['memes'], (oldData: DataQueryPages<PaginatedMemes>) => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            results: page.results.map((meme) =>
              meme.id === memeId
                ? { 
                  ...meme,
                  commentsCount: meme.commentsCount + 1 
                }
                : meme
            )
          }))
        }
      });

      return { 
        previousMemes,
      };
    },
    onError: (_, __, context) => {
      if (context?.previousMemes) {
        queryClient.setQueryData(['memes'], context.previousMemes);
      }
    },
  });
}
