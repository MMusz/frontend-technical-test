import { VStack } from "@chakra-ui/react";
import { PaginatedComments } from "../../../../types/comment.types";
import { Opt } from "../../../../types/global.types";
import { MemeWithAuthors } from "../../../../types/meme.types";
import { User } from "../../../../types/user.types";
import CommentCollapseSection from "../../../molecules/comments/CommentCollapseSection";
import MemeDescription from "../../../molecules/memes/MemeDescription";
import MemeHeader from "../../../molecules/memes/MemeHeader";
import MemePicture from "../../../molecules/memes/MemePicture";

export type MemeSectionProps = {
  meme: MemeWithAuthors;
  authUser: Opt<User>;
  commentPages: Opt<PaginatedComments[]>,
  showComments: boolean;
  hasMoreComments: boolean;
  isFetchingComments: boolean;
  isFetchingMoreComments: boolean;
  onShowComments: () => void;
  onShowMoreComments: () => void;
  onSubmitComment: (content: string) => void;
};

const MemeSection: React.FC<MemeSectionProps> = ({ 
  meme,
  authUser,
  commentPages,
  showComments,
  hasMoreComments,
  isFetchingComments,
  isFetchingMoreComments,
  onShowComments,
  onShowMoreComments,
  onSubmitComment 
}) => {
  return (
    <VStack key={meme.id} p={4} width="full" align="stretch">
      <MemeHeader
        username={meme.author?.username}
        userPictureUrl={meme.author?.pictureUrl}
        createdAt={meme.createdAt}
        dataTestId={`meme-author-${meme.id}`}
      />
      <MemePicture pictureUrl={meme.pictureUrl} texts={meme.texts} dataTestId={`meme-picture-${meme.id}`} />
      <MemeDescription content={meme.description} dataTestId={`meme-description-${meme.id}`} />

      <CommentCollapseSection
        memeId={meme.id}
        authUser={authUser}
        commentPages={commentPages}
        commentsCount={meme.commentsCount}
        showComments={showComments}
        hasNextPage={hasMoreComments}
        isFetching={isFetchingComments}
        isFetchingNextPage={isFetchingMoreComments}
        onShowComments={onShowComments}
        onShowMoreComments={onShowMoreComments}
        onSubmitComment={onSubmitComment}
      />
    </VStack>
  );
};

export default MemeSection;