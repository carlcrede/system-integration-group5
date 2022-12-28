import { useToast } from '@chakra-ui/react';

type LoginResponse = {
  user: {
    id: string;
    email: string;
    name: string;
    salt: string;
    hash: string;
  },
  jwt: {
    token: string;
    expires: string;
  }
}

export const useAuth = () => {
  const toast = useToast()
  const api_url = 'http://localhost:8080/';

  const getUserToken = () => {
    return localStorage.getItem('user');
  }

  const addUserToken = (user: Object) => {
    const token = (user as LoginResponse).jwt.token;
    localStorage.setItem('user', token);
  };

  const removeUserToken = () => {
    localStorage.removeItem("user");
  };

  const login = async (email: string, password: string) => {
    const login_res = await fetch(api_url + 'login', {
         method: 'POST', 
         headers: { 'Content-Type': 'application/json' }, 
         body: JSON.stringify({ email, password }) 
    })
    // const res = await login_res.text()
    if (!login_res.ok) {
      toast({
        title: login_res.statusText,
        status: 'error',
        isClosable: true,
      })
    }
    else {
      addUserToken(await login_res.json());
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