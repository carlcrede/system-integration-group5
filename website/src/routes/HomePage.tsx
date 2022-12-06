import { Flex, Text } from "@chakra-ui/react"
import Root from "./Root";

function HomePage() {
  return (
    <div>
      <Root />
      <Flex align={'center'} justifyContent={'center'}>
        <Text>Home</Text>
      </Flex>
    </div>
  )
}

export default HomePage;