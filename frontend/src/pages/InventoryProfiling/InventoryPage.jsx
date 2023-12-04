import React, { useState, useEffect } from 'react';
import Navbar from '../../components/wholepage/Navbar';
import client from '../../api/client';
import Cookies from 'js-cookie';

const InventoryPage = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [categoryData, setcategoryData] = useState([]);
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
        const categRes = await client.get('inventory/categories/');
        console.log("category Data",categRes.data);
        setcategoryData(categRes.data);
        
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchData();
  }, []);
  // to get data from the profilings API
  const getItemInfoById = (itemId) => {
    const item = itemData.find((item) => item.id === itemId);
    const category = categoryData.find((category) => category.id === item?.category);
    return item
      ? {
          type: item.type,
          name: item.name,
          returnable: item.returnable,
          category: category?.name || 'Unknown Category',
        }
      : { 
          type: 'Unknown Type', 
          name: 'Unknown Item', 
          returnable: false, 
          category: 'Unknown Category',
        };
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
                <th>Type</th>
                <th>Category</th>
                <th>Available</th>
                <th>Borrowed</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item) => (

                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{getItemInfoById(item.item).name}</td>
                  <td>{getItemInfoById(item.item).returnable ? 'Borrowable' : 'Consumable'}</td>
                  <td>{getItemInfoById(item.item).category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.borrowed_quantity}</td>
                  <td>
                    {getItemInfoById(item.item).returnable && (
                      <button className="btn btn-accent">View Copies</button>
                    )}
                  </td>
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
                    // <button className="btn btn-secondary" onClick={() => document.getElementById(`my_modal_${item.id}`).showModal()}>
                    //   Details
                    // </button>
                    // <dialog id={`my_modal_${item.id}`} className="modal">
                    //   <div className="modal-box flex flex-col items-center justify-center h-80%">
                    //     <div className="card w-96 bg-base-100 shadow-xl mb-4">
                    //       <figure>
                    //         {/* profile picture */}
                    //         <img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" />
                    //       </figure>
                    //       <div className="card-body">
                    //         <UserProfile userid={user.user_id} />
                    //       </div>
                    //     </div>
                    //     <div className="flex gap-4">
                    //       <button className="btn btn-accent">View Transaction</button>
                    //       <button className="btn btn-accent">View Inquiries</button>
                    //       <button className="btn btn-accent">View Posts</button>
                    //     </div>
                    //   </div>
                    //   <form method="dialog" className="modal-backdrop">
                    //     <button onClick={() => document.getElementById(`my_modal_${user.user_id}`).close()}>close</button>
                    //   </form>
                    // </dialog>