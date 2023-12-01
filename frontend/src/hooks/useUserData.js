import { useState, useEffect } from 'react';
import client from '../api/client';
import Cookies from 'js-cookie';

// Purpose is to get the data of the current logged in user

const useUserData = (userid) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const authToken = Cookies.get('authToken');
        let url = 'users/userProfile';

        // If userid is provided, append it to the URL
        if (userid) {
          url += `/${userid}`;
        }

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

    fetchData();
  }, [userid]);

  return userData;
};

export default useUserData;
