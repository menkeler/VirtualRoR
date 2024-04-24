import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import client from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const fetchData = async () => {
    const authToken = Cookies.get('authToken');

    try {
      if (authToken) {
        const res = await client.get('users/users/get_logged_in_user_details', {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        console.log(res)
        setIsLoggedIn(true);
        setUserData(res.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsDataLoaded(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const contextValue = { isLoggedIn, userData, fetchData };

  // Render children only when data is loaded
  return isDataLoaded ? (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  ) : null;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
