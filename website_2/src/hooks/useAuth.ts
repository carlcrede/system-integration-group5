import { useToast } from '@chakra-ui/react';
import axios from 'axios';

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
    login_res.headers.forEach(function(value, name) {
      console.log(name + ": " + value);
  });
    if (!login_res.ok) {
      toast({
        title: res,
        status: 'error',
        isClosable: true,
      })
    }
    else {
      // addUserToken(res);
      addUserToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2IyZWNlNDE4ZmZiZWMxZjBlNjEyZGEiLCJpYXQiOjE2NzI2NzE1OTN9.NXMCioFDVK8_7oNzb6D0FB6FQbcMqVI7lJwphGEn3Hw");
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