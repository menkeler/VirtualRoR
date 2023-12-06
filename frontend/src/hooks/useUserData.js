import { useState, useEffect } from 'react';
import client from '../api/client';
import Cookies from 'js-cookie';
import useAuth from './useAuth';
// Purpose is to get the data of the current logged in user

const useUserData = (userid) => {
  const [userData, setUserData] = useState(null);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    fetchData();
  }, [userid, isLoggedIn]);
  
  async function fetchData() {
    try {
      // Check if the user is logged in before making the API request
      if (!isLoggedIn) {
        return;
      }
      // get token okay to use for api access
      const authToken = Cookies.get('authToken');
      let url = 'users/userProfile';

      // If userid is provided, append it to the URL
      if (userid) {
        url += `/${userid}`;
      }
      // submit headers for access
      const res = await client.get(url, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      setUserData(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  return userData;
};

export default useUserData;
