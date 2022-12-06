import { useEffect, useState } from 'react';

export const useAuth = () => {
  const getUserToken = () => {
    return localStorage.getItem('user');
  }

  const addUserToken = (userToken: string) => {
    localStorage.setItem('user', JSON.stringify(userToken));
  };

  const removeUserToken = () => {
    localStorage.removeItem("user");
  };

  const login = async (email: string, password: string) => {
    const login_res = await fetch('https://si-auth-server-5rds.onrender.com/api/auth/login', {
         method: 'POST', 
         headers: { 'Content-Type': 'application/json' }, 
         body: JSON.stringify({ email, password }) 
    })
    const jwt = await login_res.text()
    if (jwt) {
        addUserToken(jwt);
    }
  };

  const logout = () => {
    removeUserToken();
  };

  return { getUserToken, login, logout };
};