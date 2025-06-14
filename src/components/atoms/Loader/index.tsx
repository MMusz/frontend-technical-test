import { Flex, Spinner } from "@chakra-ui/react"

const Loader: React.FC = () => {
  return <Flex width="full" height="full" alignItems="center" justifyContent="center">
    <Spinner color="cyan.600" size="xl" />
  </Flex>
}

export default Loader;