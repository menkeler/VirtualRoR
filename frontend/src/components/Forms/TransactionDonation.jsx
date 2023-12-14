import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Cookies from 'js-cookie';
import UsersTable from '../Displaycomponents/UsersTable';
import InventoryProfilingTable from '../Displaycomponents/InventoryProfilingTable';
const TransactionDonation = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [items , setItems] = useState([]);
  const [itemCopies , setItemCopies] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState('Good');
 
  useEffect(() => {
    // console.log("Current Items", items);
    // console.log("selec Item",selectedItemId);
    console.log(" Itemcopies",itemCopies);
  }, [items,selectedItemId,itemCopies]);

  //GENERATEUNIQUE ID FOR DELETIOPN
  function generateUniqueId() {
    return `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
  
  // set currently selected item for the add copy
  const handleAddCopy = (itemId) => {
    setSelectedItemId(itemId);
    document.getElementById('AddCopy').showModal();
  };

  const handleAddCopySubmit = (e) => {
    e.preventDefault();
  
    if (selectedItemId && selectedCondition) {
     
      const newItemCopy = {
        id: generateUniqueId(), // Using generateUniqueId to create a unique ID for handling delation of single item
        item: selectedItemId.id, 
        condition: selectedCondition,
      };
  
      // Add the new copy to the itemCopies array
      setItemCopies((prevItemCopies) => [...prevItemCopies, newItemCopy]);
  
      // Reset selected condition
      setSelectedCondition('Good');
  
      document.getElementById('AddCopy').close();
    }
  };
  
  // remove sinlge item in copies array 
  const handleRemoveCopy = (itemId, copyId) => {

    console.log('Removing copy:', itemId, copyId);

    const updatedCopies = itemCopies.filter((copy) => !(copy.item === itemId && copy.id === copyId));

    setItemCopies(updatedCopies);
  };
  

  //handle selected items that are in const = [items,setItems]
  const handleSelectItems = (selectedItem) => {
    console.log(`Selected item in TransactionDonation:`, selectedItem);
  
    const { id, name, returnable } = selectedItem;
  
    const isItemAlreadyAdded = items.some((item) => item.id === id);
  
    if (!isItemAlreadyAdded) {
      const selectedItemsData = { id, name, returnable ,quantity: returnable ? 0 : 1, };
  
      setItems((prevItems) => [...prevItems, selectedItemsData]);
      console.log("Current Items", items);
    }
  
    document.getElementById('ChooseItems').close();
  };

// handle quantity change of consumable items in the table
  const handleQuantityChange = (index, newQuantity) => {
  
    const parsedQuantity = Math.max(parseInt(newQuantity, 10) || 1, 1);
  
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = { ...updatedItems[index], quantity: parsedQuantity };
      return updatedItems;
    });
  };

  const handleRemoveItem = (index) => {
    // Get the ID of the item to be removed
    const itemIdToRemove = items[index].id;
  
    // Remove the item from the items array
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  
    // Remove item copies with the same ID from the itemCopies array
    const updatedCopies = itemCopies.filter((copy) => copy.item !== itemIdToRemove);
    setItemCopies(updatedCopies);
  };
  
  //handle selected user for transaction
   const handleSelectUser = (selectedUser) => {
    console.log(`Selected user in TransactionDonation:`, selectedUser);

    const { user_id, first_name, last_name, email } = selectedUser;

    setSelectedUser({ user_id, first_name, last_name, email });
    document.getElementById('ChooseUser').close();
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
                  <React.Fragment key={index}>
                    <tr>
                      <td>{item.name}</td>
                      {item.returnable ? (
                        <td>N/A</td>
                      ) : (
                        <td>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                            className="w-16 px-2 py-1 border rounded"
                          />
                        </td>
                      )}
                      <td>
                        <button onClick={() => handleRemoveItem(index)} className="bg-red-500 mr-5 text-white px-2 py-1 rounded">
                          Remove
                        </button>
                        {item.returnable && (
                          <button
                            className="bg-green-500 text-white px-2 py-1 rounded"
                            onClick={() => {
                              handleAddCopy({ id: item.id, name: item.name });
                              document.getElementById('AddCopy').showModal();
                            }}
                          >
                            Add Copy
                          </button>
                        )}
                      </td>
                    </tr>
                     {/* Display nested table only if the item is returnable and has matching itemCopies */}
                     {item.returnable && itemCopies.some((copy) => copy.item === item.id) && (
                      <tr>
                        <td colSpan="3">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-base-200">
                                <th className="py-2 px-4 border">Copy</th>
                                <th className="py-2 px-4 border">Condition</th>
                                <th className="py-2 px-4 border">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {itemCopies
                                .filter((copy) => copy.item === item.id)
                                .map((filteredCopy, copyIndex) => (
                                  <tr key={copyIndex}>
                                    <td className="py-2 px-4 border">Copy: {copyIndex + 1}</td>
                                    <td className="py-2 px-4 border">{filteredCopy.condition}</td>
                                    <td className="py-2 px-4 border">
                                      <button
                                        onClick={() => handleRemoveCopy(item.id, filteredCopy.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                      >
                                        Remove Copy
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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

                            
            {/* Item Copy Input */}
            <dialog id="AddCopy" className="modal fixed inset-0 z-50 overflow-y-auto">
              <div className="modal-box mx-auto max-w-2xl p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Add Copy</h3>
                {selectedItemId && (
                  <form>
                    <div className="mb-2">
                      <p>
                        <span className="font-semibold">Name:</span> {selectedItemId.name}
                      </p>
                    </div>
                    <div className="mb-2">
                      <p>
                        <span className="font-semibold">Condition:</span>
                        <select
                          className="border p-2 rounded-md"
                          value={selectedCondition}
                          onChange={(e) => setSelectedCondition(e.target.value)}
                        >
                          <option value="Good">Good</option>
                          <option value="Acceptable">Acceptable</option>
                          <option value="Like new">Like new</option>
                          <option value="Damaged">Damaged</option>
                        </select>
                      </p>
                    </div>
                    <div className="modal-action mt-6">
                      <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                        onClick={handleAddCopySubmit}
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => document.getElementById('AddCopy').close()}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                      >
                        Close
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </dialog>
            
           {/* Transaction MOdel CLOse */}
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