import React, { useState, useEffect } from 'react';
import Navbar from '../../components/wholepage/Navbar';
import client from '../../api/client';
import Cookies from 'js-cookie';
import CreateItemProfile from '../../components/CustomButtons/Inventory/CreateItemProfile';


const InventoryPage = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [categoryData, setcategoryData] = useState([]);
  const [ACategoryData, setAddCategoryData] = useState({
    name: '',
  });

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

      const itemRes = await client.get('inventory/itemprofilings/');  
      setItemData(itemRes.data);
      const categRes = await client.get('inventory/categories/');
      setcategoryData(categRes.data);

      // console.log("INVENTORY DATA",res.data);
      // console.log("itemDAta",itemRes.data);
      // console.log("category Data",categRes.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }


  const handleCategorySubmit = async (event) => {
    event.preventDefault();
    // Check if the category name is empty
    if (!ACategoryData.name.trim()) {
      return;
    }

    document.getElementById(`addCategory`).close();

    // Reset form 
    setAddCategoryData({ name: '' });
  };





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
        <button className="btn" onClick={() => document.getElementById('addCategory').showModal()}>
        Add Category
        </button>

      <dialog id="addCategory" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add Category</h3>
          {/* Form for adding a category */}
          <form onSubmit={handleCategorySubmit}>
            <div>
              <label htmlFor="categoryName">Category Name:</label>
              <input
                type="text"
                id="categoryName"
                name="categoryName"
                value={ACategoryData.name}
                onChange={(e) => setAddCategoryData({ ...ACategoryData, name: e.target.value })}
                required
              />
            </div>
            <button type="submit">Add</button>
          </form>
        </div>
        {/* Modal backdrop with close button */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => document.getElementById('addCategory').close()}>Close</button>
        </form>
      </dialog>


      <button className="btn" onClick={() => document.getElementById('viewCategory').showModal()}>
        View Category
        </button>
      <CreateItemProfile/>
      <dialog id="viewCategory" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">List of Category</h3>
         
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                </tr>
              ))}
            </tbody>
        </table>
        </div>
        {/* Modal backdrop with close button */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => document.getElementById('addCategory').close()}>Close</button>
        </form>
      </dialog>

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
                    <>
                      <button
                        className="btn"
                        onClick={() => document.getElementById(`my_modal_${item.id}`).showModal()}
                      >
                        View Copies
                      </button>
                      <dialog id={`my_modal_${item.id}`} className="modal">
                        <div className="modal-box">
                          <h3 className="font-bold text-lg">Item Copies</h3>
                          {item.item_copies?.length > 0 && (
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Copy ID</th>
                                      <th>Status</th>
                                      <th>Condition</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.item_copies.map((copy) => (
                                      <tr key={copy.id}>
                                        <td>{copy.id}</td>
                                        <td>{copy.is_borrowed_status ? 'Borrowed' : 'Available'}</td>
                                        <td>{copy.condition}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                        </div>
                        <form method="dialog" className="modal-backdrop">
                          <button onClick={() => document.getElementById(`my_modal_${item.id}`).close()}>
                            Close
                          </button>
                        </form>
                      </dialog>
                    </>
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
                



                  