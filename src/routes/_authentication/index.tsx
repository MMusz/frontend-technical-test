import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Avatar,
  Box,
  Collapse,
  Flex,
  Icon,
  LinkBox,
  LinkOverlay,
  StackDivider,
  Text,
  Input,
  VStack,
  Button,
} from "@chakra-ui/react";
import { CaretDown, CaretUp, Chat } from "@phosphor-icons/react";
import { format } from "timeago.js";
import { useAuthToken } from "../../contexts/authentication";
import { Loader } from "../../components/loader";
import { MemePicture } from "../../components/meme-picture";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { createMemeComment } from "../../services/meme.service";
import { getUserById } from "../../services/user.service";
import { useGetMemes } from "../../hooks/features/use-memes";
import { useGetMemeComments } from "../../hooks/features/use-comments";

export const MemeFeedPage: React.FC = () => {
  const token = useAuthToken();
  const [openedCommentSection, setOpenedCommentSection] = useState<
    string | null
  >(null);

  const { 
    data: memes, 
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

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await getUserById(token, jwtDecode<{ id: string }>(token).id);
    },
  });
  
  const [commentContent, setCommentContent] = useState<{
    [key: string]: string;
  }>({});
  const { mutate } = useMutation({
    mutationFn: async (data: { memeId: string; content: string }) => {
      await createMemeComment(token, data.memeId, data.content);
    },
  });
  if (isLoading) {
    return <Loader data-testid="meme-feed-loader" />;
  }
  return (
    <Flex width="full" height="full" justifyContent="center" overflowY="auto">
      <VStack
        p={4}
        width="full"
        maxWidth={800}
        divider={<StackDivider border="gray.200" />}
      >
        {memes?.pages.map((page) => {
          return page.results.map(meme =>
            <VStack key={meme.id} p={4} width="full" align="stretch">
              <Flex justifyContent="space-between" alignItems="center">
                <Flex>
                  <Avatar
                    borderWidth="1px"
                    borderColor="gray.300"
                    size="xs"
                    name={meme.author?.username}
                    src={meme.author?.pictureUrl}
                  />
                  <Text ml={2} data-testid={`meme-author-${meme.id}`}>{meme.author?.username}</Text>
                </Flex>
                <Text fontStyle="italic" color="gray.500" fontSize="small">
                  {format(meme.createdAt)}
                </Text>
              </Flex>
              <MemePicture pictureUrl={meme.pictureUrl} texts={meme.texts} dataTestId={`meme-picture-${meme.id}`} />
              <Box>
                <Text fontWeight="bold" fontSize="medium" mb={2}>
                  Description:{" "}
                </Text>
                <Box
                  p={2}
                  borderRadius={8}
                  border="1px solid"
                  borderColor="gray.100"
                >
                  <Text color="gray.500" whiteSpace="pre-line" data-testid={`meme-description-${meme.id}`}>
                    {meme.description}
                  </Text>
                </Box>
              </Box>
              <LinkBox as={Box} py={2} borderBottom="1px solid black">
                <Flex justifyContent="space-between" alignItems="center">
                  <Flex alignItems="center">
                    <LinkOverlay
                      data-testid={`meme-comments-section-${meme.id}`}
                      cursor="pointer"
                      onClick={() =>
                        setOpenedCommentSection(
                          openedCommentSection === meme.id ? null : meme.id,
                        )
                      }
                    >
                      <Text data-testid={`meme-comments-count-${meme.id}`}>{meme.commentsCount} comments</Text>
                    </LinkOverlay>
                    <Icon
                      as={
                        openedCommentSection !== meme.id ? CaretDown : CaretUp
                      }
                      ml={2}
                      mt={1}
                    />
                  </Flex>
                  <Icon as={Chat} />
                </Flex>
              </LinkBox>
              <Collapse in={openedCommentSection === meme.id} animateOpacity>
                <Box mb={6}>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (commentContent[meme.id]) {
                        mutate({
                          memeId: meme.id,
                          content: commentContent[meme.id],
                        });
                      }
                    }}
                  >
                    <Flex alignItems="center">
                      <Avatar
                        borderWidth="1px"
                        borderColor="gray.300"
                        name={user?.username}
                        src={user?.pictureUrl}
                        size="sm"
                        mr={2}
                      />
                      <Input
                        placeholder="Type your comment here..."
                        onChange={(event) => {
                          setCommentContent({
                            ...commentContent,
                            [meme.id]: event.target.value,
                          });
                        }}
                        value={commentContent[meme.id]}
                      />
                    </Flex>
                  </form>
                </Box>
                <VStack align="stretch" spacing={4}>
                  {comments?.pages.map((page) => {
                    return page.results.map(comment =>
                      <Flex key={comment.id}>
                        <Avatar
                          borderWidth="1px"
                          borderColor="gray.300"
                          size="sm"
                          name={comment.author?.username}
                          src={comment.author?.pictureUrl}
                          mr={2}
                        />
                        <Box p={2} borderRadius={8} bg="gray.50" flexGrow={1}>
                          <Flex
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Flex>
                              <Text data-testid={`meme-comment-author-${meme.id}-${comment.id}`}>{comment.author?.username}</Text>
                            </Flex>
                            <Text
                              fontStyle="italic"
                              color="gray.500"
                              fontSize="small"
                            >
                              {format(comment.createdAt)}
                            </Text>
                          </Flex>
                          <Text color="gray.500" whiteSpace="pre-line" data-testid={`meme-comment-content-${meme.id}-${comment.id}`}>
                            {comment.content}
                          </Text>
                        </Box>
                      </Flex>
                    )}
                  )}
                  {hasMoreComments && (
                    <Flex width="full" justifyContent="center">
                      <Button
                        data-testid={'comment-load-more-button'}
                        isLoading={isFetchingMoreComments}
                        loadingText="Loading more..."
                        disabled={isFetchingComments}
                        onClick={() => fetchMoreComments()}
                      >
                        Load More
                      </Button>
                    </Flex>
                  )}
                </VStack>
              </Collapse>
            </VStack>
          );
        })}
        {hasNextPage && (
          <Flex width="full" justifyContent="center">
            <Button
              data-testid={'meme-load-more-button'}
              isLoading={isFetchingNextPage}
              loadingText="Loading more..."
              disabled={isLoading}
              onClick={() => fetchNextPage()}
            >
              Load More
            </Button>
          </Flex>
        )}
      </VStack>
    </Flex>
  );
};

export const Route = createFileRoute("/_authentication/")({
  component: MemeFeedPage,
});
