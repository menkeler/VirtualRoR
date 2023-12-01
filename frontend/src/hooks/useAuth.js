import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Purpose is to get the token from the cookies and us it for authentication acces to api

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authToken = Cookies.get('authToken');
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);

  return { isLoggedIn };
};

export default useAuth;
