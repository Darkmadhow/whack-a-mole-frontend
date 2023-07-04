import { createContext, useEffect, useState } from 'react';
import { getUser } from './utils/auth';

export const UserContext = createContext({});

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('token') ? true : false
  );
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    (async () => {
      if (token) setUser(await getUser(token));
    })();
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        isLoading,
        setIsLoading,
        isAuthenticated,
        setIsAuthenticated,
        isMuted,
        setIsMuted,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
