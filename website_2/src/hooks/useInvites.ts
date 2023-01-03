import { useToast } from '@chakra-ui/react';

export const useInvites = () => {
  const toast = useToast()
  const api_url = 'https://lionfish-app-hsj4b.ondigitalocean.app/'; // TODO: change with actual invite server when/if we have one

  const getUserToken = () => {
    return localStorage.getItem('user');
  }

  const sendInvite = async (invitedEmail: string) => {
    const invite_res = await fetch(api_url + '/send-invite', { // TODO: change with actual send invite endpoint when/if we have one
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getUserToken()
      },
      body: JSON.stringify({ invitedEmail })
    })
    if (!invite_res.ok) {
      toast({
        title: "Failed to send invite",
        status: 'error',
        isClosable: true,
      })
    }
    return invite_res.ok
  };

  const checkIfInviteExists = async (token: string) => {
    const invite_res = await fetch(api_url + 'invites/exists/' + token, { // TODO: change with actual check invite endpoint when/if we have one
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getUserToken()
      },
    })
    if (!invite_res.ok) {
      toast({
        title: "Invite not found",
        status: 'error',
        isClosable: true,
      })
    }
    return invite_res.ok
  };

  const acceptInvite = async (token: string) => {
    const invite_res = await fetch(api_url + 'invites/' + token, { // TODO: change with actual accept invite endpoint when/if we have one
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getUserToken()
      },
    })
    if (!invite_res.ok) {
      toast({
        title: "Failed to accept invite",
        status: 'error',
        isClosable: true,
      })
    }
    return invite_res.ok
  };

  return { sendInvite, acceptInvite, checkIfInviteExists };
};