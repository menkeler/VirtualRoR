import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

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
