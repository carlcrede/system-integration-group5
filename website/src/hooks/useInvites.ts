import { useToast } from '@chakra-ui/react';

export const useInvites = () => {
  const toast = useToast()
  const api_url = 'https://si-auth-server-5rds.onrender.com/api/'; // TODO: change with actual invite server when/if we have one

  const getUserToken = () => {
    return localStorage.getItem('user');
  }

  const sendInvite = async (email: string) => {
    const invite_res = await fetch(api_url + 'invites', { // TODO: change with actual send invite endpoint when/if we have one
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getUserToken()
      },
      body: JSON.stringify({ email })
    })
    if (!invite_res.ok) {
      toast({
        title: await invite_res.text(),
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
        title: await invite_res.text(),
        status: 'error',
        isClosable: true,
      })
    }
    return invite_res.ok
  };

  return { sendInvite, acceptInvite };
};