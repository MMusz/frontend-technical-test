import { useState } from "react";
import { Avatar, Box, Flex, Input } from "@chakra-ui/react";

export type CommentFormProps = {
  username: string;
  userPictureUrl: string;
  dataTestId: string;
  onSubmitComment: (content: string) => void;
};

const CommentForm: React.FC<CommentFormProps> = ({ username, userPictureUrl, dataTestId, onSubmitComment }) => {
  const [commentContent, setCommentContent] = useState<string>('');

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentContent(event.target.value);
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (commentContent) {
      onSubmitComment(commentContent);
      setCommentContent('');
    }
  };

  return (
    <Box mb={6}>
      <form onSubmit={handleOnSubmit} data-testid={dataTestId}>
        <Flex alignItems="center">
          <Avatar
            borderWidth="1px"
            borderColor="gray.300"
            name={username}
            src={userPictureUrl}
            size="sm"
            mr={2}
          />
          <Input
            data-testid={`${dataTestId}-input`}
            placeholder="Type your comment here..."
            onChange={handleOnChange}
            value={commentContent}
          />
        </Flex>
      </form>
    </Box>
  )
};

export default CommentForm;