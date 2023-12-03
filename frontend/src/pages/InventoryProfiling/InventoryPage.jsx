import React, { useState, useEffect } from 'react';
import Navbar from '../../components/wholepage/Navbar';
import client from '../../api/client';
import Cookies from 'js-cookie';

const InventoryPage = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [itemData, setItemData] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const authToken = Cookies.get('authToken');
        let url = 'inventory/inventories/';

        const res = await client.get(url, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        

        console.log("INVENTORY DATA",res.data);
        setInventoryData(res.data); // Assuming the API response is an array of inventory items
        const itemRes = await client.get('inventory/itemprofilings/');
        console.log("itemDAta",itemRes.data);
        setItemData(itemRes.data);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchData();
  }, []);
  // to get data from the profilings API
  const getItemNameById = (itemId) => {
    const item = itemData.find((item) => item.id === itemId);
    return item ? item.name : 'Unknown Item';
  };


  return (
    <>
      <Navbar />
      <div>
        <h1>Inventory Page</h1>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Borrowed</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{getItemNameById(item.item)}</td>
                  <td>{item.quantity}</td>
                  <td>{item.borrowed_quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default InventoryPage;
