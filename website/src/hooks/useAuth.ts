import { useToast } from '@chakra-ui/react';

export const useAuth = () => {
  const toast = useToast()
  const api_url = 'https://si-auth-server-5rds.onrender.com/api/';

  const getUserToken = () => {
    return localStorage.getItem('user');
  }

  const addUserToken = (userToken: string) => {
    localStorage.setItem('user', userToken);
  };

  const removeUserToken = () => {
    localStorage.removeItem("user");
  };

  const login = async (email: string, password: string) => {
    const login_res = await fetch(api_url + 'auth/login', {
         method: 'POST', 
         headers: { 'Content-Type': 'application/json' }, 
         body: JSON.stringify({ email, password }) 
    })
    const res = await login_res.text()
    if (!login_res.ok) {
      toast({
        title: res,
        status: 'error',
        isClosable: true,
      })
    }
    else {
      addUserToken(res);
    }
    return login_res.ok
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    const sign_up_res = await fetch(api_url + 'auth/register', {
         method: 'POST', 
         headers: { 'Content-Type': 'application/json' }, 
         body: JSON.stringify({ email, password, firstName, lastName }) 
    })
    if (!sign_up_res.ok) {
      toast({
        title: await sign_up_res.text(),
        status: 'error',
        isClosable: true,
      })
    }
    return sign_up_res.ok
  };

  const logout = () => {
    removeUserToken();
  };

  return { getUserToken, login, logout, signUp };
};