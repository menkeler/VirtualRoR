import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Cookies from 'js-cookie';
import UsersTable from '../Displaycomponents/UsersTable';
import InventoryProfilingTable from '../Displaycomponents/InventoryProfilingTable';
const TransactionDonation = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [items , setItems] = useState([]);
  const [inventoryProfile , setInventoryProfile] = useState([]);
  


  const fetchData = async () => {
    const authToken = Cookies.get('authToken');
    try {
      if (authToken) {
        const res = await client.get('inventory/item-profiling/', {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        setInventoryProfile(res.data)
        console.log(res.data)
      }
    } catch (error) {
      console.error('Error fetching inventory profile data:', error);    
    }
  };

  useEffect(() => {
    console.log("Current Items", items);
    fetchData();
  }, [items]);







  const handleSelectUser = (selectedUser) => {
    console.log(`Selected user in TransactionDonation:`, selectedUser);

    const { user_id, first_name, last_name, email } = selectedUser;

    setSelectedUser({ user_id, first_name, last_name, email });
    document.getElementById('ChooseUser').close();
  };

  const handleSelectItems = (selectedItem) => {
    console.log(`Selected item in TransactionDonation:`, selectedItem);
  
    const { id, name, returnable } = selectedItem;
  
    const isItemAlreadyAdded = items.some((item) => item.id === id);
  
    if (!isItemAlreadyAdded) {
      const selectedItemsData = { id, name, returnable ,quantity: 0 };
  
      setItems((prevItems) => [...prevItems, selectedItemsData]);
      console.log("Current Items", items);
    }
  
    document.getElementById('ChooseItems').close();
  };
  

  const handleRemoveItem = (index) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems.splice(index, 1);
      return updatedItems;
    });
  };






  return (
    <>
      <div>TransactionDonation</div>

      <button className="btn" onClick={() => document.getElementById('TransactionDonation').showModal()}>Donation</button>
      <dialog id="TransactionDonation" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Transaction Donation</h3>
          <p className="py-4">Fill in the form</p>
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-lg">Donor</h3>
            <h1 className="mb-4">
              <div className="flex items-center space-x-4">
                {selectedUser && (
                  <>
                    <div className="p-4 border rounded-lg bg-gray-100">
                      <p className="font-semibold text-gray-600">ID:</p>
                      <p className="text-blue-500">{selectedUser.user_id}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-100">
                      <p className="font-semibold text-gray-600">Name:</p>
                      <p className="text-blue-500">{selectedUser.first_name} {selectedUser.last_name}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-100">
                      <p className="font-semibold text-gray-600">Email:</p>
                      <p className="text-blue-500">{selectedUser.email}</p>
                    </div>
                  </>
                )}
                <button className="btn" onClick={() => document.getElementById('ChooseUser').showModal()}>Choose user</button>
              </div>
            </h1>
            {/* User Modal Content */}
            <dialog id="ChooseUser" className="modal">
              <div className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg">Users</h3>
                <UsersTable type={2} onSelectUser={handleSelectUser} />
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
          <h3 className="font-bold text-lg">Item</h3>


            <h1 className="mb-4">
            <button className="btn" onClick={() => document.getElementById('ChooseItems').showModal()}>Choose Items</button>
            {/* Include the table here */}
            <div className="overflow-x-auto w-full max-h-screen">
            <table className="table w-full">
              {/* head */}
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    {item.returnable ? (
                      <td>N/A</td>
                    ) : (
                      <td>{item.quantity}</td>
                    )}
                    <td>
                      <button onClick={() => handleRemoveItem(index)} className="bg-red-500 text-white px-2 py-1 rounded">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </h1>
          {/* Item profile Content */}
          <dialog id="ChooseItems" className="modal">
              <div className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg">Items Here</h3>
             
                  <InventoryProfilingTable onSelectItem={handleSelectItems}/>

                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          <div>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default TransactionDonation;