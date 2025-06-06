import { Avatar, Flex, Text } from "@chakra-ui/react";
import { format } from "timeago.js";
import { Opt } from "../../../../types/global.types";

export type MemeHeaderProps = {
  username: Opt<string>;
  userPictureUrl: Opt<string>;
  createdAt: string;
  dataTestId: string;
};

const MemeHeader: React.FC<MemeHeaderProps> = ({
  username,
  userPictureUrl,
  createdAt,
  dataTestId,
}) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Flex>
        <Avatar
          borderWidth="1px"
          borderColor="gray.300"
          size="xs"
          name={username}
          src={userPictureUrl}
        />
        <Text ml={2} data-testid={dataTestId}>{username}</Text>
      </Flex>
      <Text fontStyle="italic" color="gray.500" fontSize="small">
        {format(createdAt)}
      </Text>
    </Flex>
  );
};

export default MemeHeader;