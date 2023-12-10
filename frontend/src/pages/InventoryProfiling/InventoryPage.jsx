import React, { useState, useEffect } from 'react';
import Navbar from '../../components/wholepage/Navbar';
import client from '../../api/client';
import Cookies from 'js-cookie';


const InventoryPage = () => {
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const authToken = Cookies.get('authToken');
      let url = 'inventory/inventories/';
      const res = await client.get(url, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      }); 
      setInventoryData(res.data); 

      console.log("Item Data",res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return(
    <>

    <Navbar/>d
    </>
  );
};

export default InventoryPage;
                



                  