import { Button, Flex } from "@chakra-ui/react"

export type LoadMoreButtonProps = {
  hasNextPage: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  dataTestId: string;
  fetchMore: () => void;
};

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  hasNextPage,
  isFetching,
  isFetchingNextPage,
  dataTestId,
  fetchMore,
}) => {
  if (!hasNextPage) {
    return null;
  }

  return (
    <Flex width="full" justifyContent="center">
      <Button
        data-testid={dataTestId}
        isLoading={isFetchingNextPage}
        loadingText="Loading more..."
        disabled={isFetching}
        onClick={() => fetchMore()}
      >
        Load More
      </Button>
    </Flex>
  );
};

export default LoadMoreButton;
