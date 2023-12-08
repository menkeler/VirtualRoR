import { useState, useEffect } from 'react';
import client from '../api/client';
import Cookies from 'js-cookie';
import useAuth from './useAuth';

// If userid is empty, it will retrieve the currently logged-in user

const useUserData = (userid) => {
  const [userData, setUserData] = useState(null);
  const { isLoggedIn } = useAuth(); // Move the useAuth hook inside the functional component

  useEffect(() => {
    fetchData();
  }, [userid, isLoggedIn]);

  async function fetchData() {
    try {
      if (!isLoggedIn) {
        return;
      }
      const authToken = Cookies.get('authToken');

      let url = `users/users/get_logged_in_user_details/`;

      if (userid !== null && userid !== undefined) {
        url = `users/users/${userid}/`;
      }

      const res = await client.get(url, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      console.log(res.data);
      setUserData(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return userData;
};

export default useUserData;