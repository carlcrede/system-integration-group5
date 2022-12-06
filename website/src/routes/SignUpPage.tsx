import { Flex, Text } from "@chakra-ui/react"
import PageTemplate from "../containers/PageTemplate";

function SignUpPage() {
  return (
    <PageTemplate selectedIndex={1}>
      <Flex align={'center'} justifyContent={'center'}>
        <Text>Sign Up</Text>
      </Flex>
    </PageTemplate>
  )
}

export default SignUpPage;