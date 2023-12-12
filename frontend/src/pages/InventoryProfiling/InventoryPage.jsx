import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Navbar from '../../components/wholepage/Navbar';
import Cookies from 'js-cookie';
import { useAuth } from '../../contexts/AuthContext';
const InventoryPage = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { userData } = useAuth(); 


  const fetchData = async () => {
    const authToken = Cookies.get('authToken');
    try {
      if (authToken) {
        const res = await client.get('inventory/inventories/', {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        const catRes = await client.get('inventory/categories/', {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        setInventoryData(res.data);
        console.log("inventort",res.data);

        setCategoryData(catRes.data);
        console.log("catres",catRes.data);
      }
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      // Handle error as needed, e.g., show an error message to the user
    } finally {
      setIsDataLoaded(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [/* Include any dependencies, such as authToken */]);

  return (
    <>
      <Navbar />
      {isDataLoaded ? (
        <div>
         
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default InventoryPage;
