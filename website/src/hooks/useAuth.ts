import { useEffect, useState } from 'react';

export const useAuth = () => {
  const api_url = 'https://si-auth-server-5rds.onrender.com/api/';
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
    const login_res = await fetch(api_url + 'auth/login', {
         method: 'POST', 
         headers: { 'Content-Type': 'application/json' }, 
         body: JSON.stringify({ email, password }) 
    })
    const jwt = await login_res.text()
    if (jwt && login_res.ok) {
        addUserToken(jwt);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    return fetch(api_url + 'auth/register', {
         method: 'POST', 
         headers: { 'Content-Type': 'application/json' }, 
         body: JSON.stringify({ email, password, firstName, lastName }) 
    })
  };

  const logout = () => {
    removeUserToken();
  };

  return { getUserToken, login, logout, signUp };
};