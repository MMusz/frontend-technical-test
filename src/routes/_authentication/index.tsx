import { createFileRoute } from "@tanstack/react-router";
import { Flex, StackDivider, VStack } from "@chakra-ui/react";
import { Loader } from "../../components/loader";
import { useState } from "react";
import { useGetMemes } from "../../hooks/features/use-memes";
import { useGetMemeComments, usePostComment } from "../../hooks/features/use-comments";
import Alert from "../../components/atoms/Alert";
import MemeSection from "../../components/organisms/memes/MemeSection";
import LoadMoreButton from "../../components/atoms/LoadMoreButton";
import { useGetUserById } from "../../hooks/features/use-users";
import { useAuthProvider } from "../../hooks/features/use-providers";
import { Nullable } from "../../types/global.types";

export const MemeFeedPage: React.FC = () => {
  const { id: authUserId } = useAuthProvider();
  const [openedCommentSection, setOpenedCommentSection] = useState<
    Nullable<string>
  >(null);

  const { data: user } = useGetUserById(authUserId);

  const { 
    data: memes,
    error: memeError,
    isFetching: isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetMemes();

  const { 
    data: comments,
    isFetching: isFetchingComments,
    isFetchingNextPage: isFetchingMoreComments,
    fetchNextPage: fetchMoreComments,
    hasNextPage: hasMoreComments,
  } = useGetMemeComments(openedCommentSection);

  const { mutate: postComment } = usePostComment();

  const handleOpenSection = (memeId: string) => {
    setOpenedCommentSection(
      openedCommentSection === memeId ? null : memeId,
    )
  };

  const handleSubmitComment = (content: string, memeId: string) => {
    postComment({ memeId, content });
  };
  
  if (!memes && isLoading) {
    return <Loader data-testid="meme-feed-loader" />;
  }
  return (
    <Flex width="full" height="full" justifyContent="center" overflowY="auto">
      {memeError !== null && (
        <Alert variant="warning" title="Oops!" description="An error occured, try again later!" />
      )}
      <VStack
        p={4}
        width="full"
        maxWidth={800}
        divider={<StackDivider border="gray.200" />}
      >
        {memes?.pages.map((page) => {
          return page.results.map(meme =>
            <MemeSection
              key={`meme-section-${meme.id}`}
              meme={meme}
              authUser={user}
              commentPages={comments?.pages}
              showComments={openedCommentSection === meme.id}
              hasMoreComments={hasMoreComments}
              isFetchingComments={isFetchingComments}
              isFetchingMoreComments={isFetchingMoreComments}
              onShowMoreComments={() => fetchMoreComments()}
              onShowComments={() => handleOpenSection(meme.id)}
              onSubmitComment={(content: string) => handleSubmitComment(content, meme.id)}
            />
          );
        })}
        <LoadMoreButton
          dataTestId={'meme-load-more-button'}
          hasNextPage={hasNextPage}
          isFetching={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          fetchMore={fetchNextPage}
        />
      </VStack>
    </Flex>
  );
};

export const Route = createFileRoute("/_authentication/")({
  component: MemeFeedPage,
});
