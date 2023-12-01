import { useState, useEffect } from 'react';
import client from '../api/client';
import Cookies from 'js-cookie';

const useUserData = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const authToken = Cookies.get('authToken');
        const res = await client.get('users/userProfile', {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        setUserData(res.data);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchData();

  }, []);

  return userData;
};

export default useUserData;
