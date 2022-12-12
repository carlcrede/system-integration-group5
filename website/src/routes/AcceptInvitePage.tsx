import {
  Box,
  Flex,
  Text,
  VStack,
  Button,
  Spacer,
} from "@chakra-ui/react"
import { useNavigate, useParams } from "react-router-dom";
import PageTemplate from "../containers/PageTemplate";
import { useInvites } from "../hooks/useInvites";
import { useEffect } from 'react';

function AcceptInvitePage() {
  const navigate = useNavigate();
  const { acceptInvite, checkIfInviteExists } = useInvites();

  let { token } = useParams<{ token: string }>();

  async function forceAcceptInvite(token: string) {
    const acceptInviteRes = await acceptInvite(token)
    if (acceptInviteRes) {
      navigate('/')
    }
  }

  async function forceCheckIfInviteExists(token: string) {
    const checkIfInviteExistsRes = await checkIfInviteExists(token)
    if (!checkIfInviteExistsRes) {
      navigate('/')
    }
  }

  useEffect(() => {
    forceCheckIfInviteExists(token as string)
  }, [])

  return (
    <PageTemplate selectedIndex={2}>
      <Box w="100%">
        <Flex h='calc(100vh - 550px)' flexDirection="column">
          <VStack>
            <Text fontSize='x-large'>Accept Invites</Text>
            <Spacer />
            <Text fontSize='md'>Are you sure you want to accept the invitation?</Text>
            <Button onClick={() => forceAcceptInvite(token as string)}>Accept</Button>
          </VStack>
        </Flex>
      </Box>
    </PageTemplate>
  )
}

export default AcceptInvitePage;