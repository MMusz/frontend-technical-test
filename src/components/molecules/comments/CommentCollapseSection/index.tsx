import {
  Box,
  Collapse,
  Flex,
  Icon,
  LinkBox,
  LinkOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CaretDown, CaretUp, Chat } from "@phosphor-icons/react";
import { PaginatedComments } from "../../../../types/comment.types";
import { Opt } from "../../../../types/global.types";
import { User } from "../../../../types/user.types";
import LoadMoreButton from "../../../atoms/LoadMoreButton";
import CommentDetails from "../CommentDetails";
import CommentForm from "../CommentForm";

export type CommentCollapseSectionProps = {
  memeId: string;
  authUser: Opt<User>;
  commentPages: Opt<PaginatedComments[]>;
  commentsCount: number;
  showComments: boolean;
  hasNextPage: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  onShowComments: () => void;
  onShowMoreComments: () => void;
  onSubmitComment: (content:string) => void;
};

const CommentCollapseSection: React.FC<CommentCollapseSectionProps> = ({
  memeId,
  authUser,
  commentPages,
  commentsCount,
  showComments,
  hasNextPage,
  isFetching,
  isFetchingNextPage,
  onShowComments,
  onShowMoreComments,
  onSubmitComment,
}) => {
  return (
    <>
      <LinkBox as={Box} py={2} borderBottom="1px solid black">
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <LinkOverlay
              data-testid={`meme-comments-section-${memeId}`}
              cursor="pointer"
              onClick={() => onShowComments()}
            >
              <Text data-testid={`meme-comments-count-${memeId}`}>{commentsCount} comments</Text>
            </LinkOverlay>
            <Icon
              as={showComments ? CaretDown : CaretUp}
              ml={2}
              mt={1}
            />
          </Flex>
          <Icon as={Chat} />
        </Flex>
      </LinkBox>
      <Collapse in={showComments} animateOpacity>
        <CommentForm
          dataTestId={`meme-comments-section-form-${memeId}`}
          username={authUser?.username ?? 'unknown'}
          userPictureUrl={authUser?.pictureUrl ?? ''}
          onSubmitComment={onSubmitComment}
        />
        <VStack align="stretch" spacing={4}>
          {commentPages?.map((page) => {
            return page.results.map(comment => <CommentDetails comment={comment} />)
          })}
          <LoadMoreButton
            dataTestId={`meme-comments-section-load-more-${memeId}`}
            hasNextPage={hasNextPage}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
            fetchMore={onShowMoreComments}
          />
        </VStack>
      </Collapse>
    </>
  );
};

export default CommentCollapseSection;