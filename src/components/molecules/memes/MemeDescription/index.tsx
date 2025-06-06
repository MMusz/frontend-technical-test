import { Box, Text } from "@chakra-ui/react";
import { Opt } from "../../../../types/global.types";

export type MemeDescriptionProps = {
  content: Opt<string>;
  dataTestId: string;
};

const MemeDescription: React.FC<MemeDescriptionProps> = ({
  content,
  dataTestId,
}) => {
  return (
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
        <Text color="gray.500" whiteSpace="pre-line" data-testid={dataTestId}>
          {content}
        </Text>
      </Box>
    </Box>
  );
};

export default MemeDescription;