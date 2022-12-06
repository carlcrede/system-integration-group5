import { Flex, Text } from "@chakra-ui/react"
import NavBar from "../components/NavBar";

function SignUpPage() {
  return (
    <div>
    <NavBar />
      <Flex align={'center'} justifyContent={'center'}>
        <Text>Sign Up</Text>
      </Flex>
    </div>
  )
}

export default SignUpPage;