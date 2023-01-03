import { createContext } from 'react';

interface AuthContext {
  getUserToken: () => void;
}

export const AuthContext = createContext<AuthContext>({
  getUserToken: () => {},
});