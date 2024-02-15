import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Cookies from 'js-cookie';
import InventoryTable from '../Displaycomponents/InventoryTable';
import UsersTable from '../Displaycomponents/UsersTable';
import ManualUserCreation from '../CustomButtons/Transactions/ManualUserCreation';
const TransactionRelease = () => {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [Remarks, setRemarks] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [items, setItems] = useState([])

  const initialPayload = {
    user_id: currentUser.user_id,
    remarks: "test",
    transaction_items: []
  };

  const [payload, setPayload] = useState(initialPayload);
  
  const handleUserIdChange = (userData) => {
    handleSelectUser(userData)
    // You can perform additional actions or set state in the parent component if needed
  };
  const handleSelectUser = (selectedUser) => {
    // console.log(`Selected user in TransactionDonation:`, selectedUser);

    const { user_id, first_name, last_name, email } = selectedUser;
    setPayload(prevPayload => ({
      ...prevPayload,
      user_id: user_id
  }));
    setCurrentUser({ user_id, first_name, last_name, email });
    console.log(`Selected user in TransactionDonation:`, selectedUser);
    document.getElementById('ChooseUser').close();
  };
  
  const addItemToPayload = (item) => {
    // Convert the id property to the item property
    const newItem = item.condition ? { ...item, item: item.id, quantity: 1 } : { ...item, quantity: 1 };
    delete newItem.id;

    // Check if the item already exists in the transaction_items array based on both id and item properties
    const isDuplicate = payload.transaction_items.some(existingItem => 
        existingItem.id === item.id || existingItem.item === newItem.item
    );
    
    // If the item is not a duplicate, add it to the payload
    if (!isDuplicate) {
        // If the item has a condition, create a new object with item instead of id
        const itemToAdd = newItem;

        setPayload(prevState => ({
            ...prevState,
            transaction_items: [...prevState.transaction_items, itemToAdd]
        }));
    } else {
        console.log("Item is already in the payload.");
    }
};





  
  const handleItemAdd  = (item) => {
   
    addItemToPayload(item);
  
  };

  const fetchInquiries = async (page) => {
    try {
      const response = await client.get(`transactions/inquiries/?page=${page}&ordering=status&status=Accepted&type=Reservation&search=${searchQuery}`);
      console.log(response.data)
      const { results, count } = response.data;
      setInquiries(results);
      setTotalPages(Math.ceil(count / 50));

    } catch (error) {
      console.error('Error fetching transactions:', error);
      setCurrentPage(1);
    }
  };  

  useEffect(() => {
    fetchInquiries(currentPage)
    console.log("payload",payload);
    console.log("inquiries",selectedInquiry);   
  }, [currentPage,searchQuery,selectedInquiry,payload]);

  // INquiry selected
  const handleSelectInquiry = (inquiry) => {
    
    setSelectedInquiry(inquiry);
    
    document.getElementById('SelectTransaction').close();
  };

  //REmarks
  const handleRemarksChange = (e) => {
      setRemarks(e.target.value);
  };

  //user token ehre for now

  const authToken = Cookies.get('authToken');
  //SUbmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(Remarks&&selectedInquiry){
      console.log('submit')
      

      try {
        const transactionData = {
          "remarks": Remarks,
        };

        const responseTransaction = await client.post(`transactions/process_transaction/${selectedInquiry.id}/`, transactionData ,{
          headers: {
            Authorization: `Token ${authToken}`,
            'Content-Type': 'application/json',
          }
        });
        
      
        if (responseTransaction.status >= 200 && responseTransaction.status < 300) {
          // Request was successful
          console.log('Transaction successful:', responseTransaction.data);
        } else {
          // Request was not successful
          console.error('Transaction failed with status:', responseTransaction.status);
        }

      } catch (error) {
        // Handle error
        console.error('Error:', error);
      }
      
      document.getElementById('CreateTransaction').close();
    }
   
  }

  const handleSubmitWalkin = async (e) => {
    e.preventDefault();
    

      console.log('submit')
      

      try {

        const responseTransaction = await client.post(`transactions/process_walkin/`, payload ,{
          headers: {
            Authorization: `Token ${authToken}`,
            'Content-Type': 'application/json',
          }
        });
        
      
        if (responseTransaction.status >= 200 && responseTransaction.status < 300) {
          // Request was successful
          console.log('Transaction successful:', responseTransaction.data);
        } else {
          // Request was not successful
          console.error('Transaction failed with status:', responseTransaction.status);
        }

      } catch (error) {
        // Handle error
        console.error('Error:', error);
      }
      
      document.getElementById('CreateTransaction').close();
  
   
  }
  
  return (
    <>
    
    <button className="btn" onClick={()=>document.getElementById('CreateTransaction').showModal()}>Release</button>


    {/* Modal */}
    <dialog id="CreateTransaction" className="modal">
    <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg">Create Transaction</h3>
        <button className="btn mx-2 mt-2" onClick={()=>document.getElementById('SelectInventory').showModal()}>Walk-In</button> 
        <button className="btn mx-2 mt-2" onClick={()=>document.getElementById('SelectTransaction').showModal()}>Load Reservations</button> 

        <div className="flex flex-col items-center">

          {selectedInquiry && (
            <>
              <h3 className="font-bold mt-3 text-lg">Reservation ID: {selectedInquiry.id}</h3>
            </>
          ) 
          }
          <ManualUserCreation onUserIdChange={handleUserIdChange}/>
                <button className="btn btn-accent" onClick={() => document.getElementById('ChooseUser').showModal()}>Choose user</button>
              <h3 className="font-bold mt-3 text-lg">Inquirer</h3>
              <h1 className="mb-4">
                <div className="flex items-center space-x-4 mt-3">
              
                  {selectedInquiry && (
                    <>
                      <div className="p-4 border rounded-lg bg-gray-100">
                        <p className="font-semibold text-gray-600">ID:</p>
                        <p className="text-blue-500">{selectedInquiry.inquirer.user_id}</p>
                      </div>
                      <div className="p-4 border rounded-lg bg-gray-100">
                        <p className="font-semibold text-gray-600">Name:</p>
                        <p className="text-blue-500">{selectedInquiry.inquirer.first_name} {selectedInquiry.inquirer.last_name}</p>
                      </div>
                      <div className="p-4 border rounded-lg bg-gray-100">
                        <p className="font-semibold text-gray-600">Email:</p>
                        <p className="text-blue-500">{selectedInquiry.inquirer.email}</p>
                      </div>
                    </>
                  )}
                  
                </div>
              </h1>
              <h3 className="font-bold mt-3 text-lg">Items</h3>
              <div className="overflow-x-auto w-full max-h-screen">
                <table className="table w-full">
                      <thead>
                      <tr>
                          <th></th>
                          <th className="text-center">Name</th>
                          <th className="text-center">Quantity/Condition</th>
                      </tr>
                      </thead>
                      <tbody>
                      {selectedInquiry && selectedInquiry.reserved_items.map((result, index) => (
                      <tr key={result.id}>
                          <td>{index+1}</td>
                          {result.item ? (
                          <>
                              <td className="truncate text-center">{result.item.inventory.itemprofiling.item_name} ID: {result.item.id}</td>
                              <td className="text-center">{result.item.condition}</td>
                          </>
                          ) : (
                          <>
                              <td className="text-center">{result.inventory.item.name}</td>
                              <td className="text-center">{result.quantity}</td>
                          </>
                          )}
                      </tr>
                      ))}

                         {payload && payload.transaction_items.map((result, index) => (
                      <tr key={result.id}>
                          <td>{index+1}</td>
                          {result.inventory ? (
                          <>
                              <td className="truncate text-center">{result.inventory.itemprofiling.item_name} ID: {result.inventory.id}</td>
                              <td className="text-center">{result.condition}</td>
                          </>
                          ) : (
                          <>
                              <td className="text-center">{result.item.name}</td>
                              <td className="text-center">{result.quantity}</td>
                          </>
                          )}
                      </tr>
                      ))}

                      </tbody>
                  </table>
              </div> 
              {/* Rmearks   */}
                
              <h3 className="mt-5 font-bold text-lg">Remarks</h3>
              <textarea
                className="resize-none border rounded-md p-2 mt-2 w-full"
                placeholder="Enter your remarks here..."
                value={Remarks}
                onChange={handleRemarksChange}
              />
            
          </div>

        <div className="modal-action">
          <form method="dialog">

          <button type="button" className='btn btn-accent mr-2 text-white' 
           onClick={handleSubmitWalkin}
          
           >Submit</button>
           <button type="button" className='btn btn-accent mr-2 text-white' 
           onClick={handleSubmit}
           disabled={!Remarks.trim()||!selectedInquiry||!inquiries}
           >Submit</button>


            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>

   
    <dialog id="SelectTransaction" className="modal">
    <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg">Select Reservation</h3>
        <p className="py-4"></p>
        <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
            />
        <div className="mt-4 grid gap-4 grid-cols-2">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-5 bg-white rounded-lg shadow-md">
                <h2 className="text-base font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap mb-2 text-truncate">
                 Reservation ID: {inquiry.id}
                </h2>
                <p className="text-sm text-gray-600 overflow-hidden overflow-ellipsis whitespace-nowrap mb-2 text-truncate">
                Inquirer: {inquiry.inquirer.first_name} {inquiry.inquirer.last_name}
                </p>
                <h2 className="text-base font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap mb-2 text-truncate">Items</h2>
                <div className="overflow-x-auto">
                <table className="table">
             
                    <thead>
                    <tr>
                        <th></th>
                        <th className="text-center">Name</th>
                        <th className="text-center">Quantity/Condition</th>
                    </tr>
                    </thead>
                    <tbody>
                    {inquiry.reserved_items.map((result, index) => (
                    <tr key={result.id}>
                        <td>{index+1}</td>
                        {result.item ? (
                        <>
                            <td className="truncate text-center">{result.item.inventory.itemprofiling.item_name} ID: {result.id}</td>
                            <td className="text-center">{result.item.condition}</td>
                        </>
                        ) : (
                        <>
                            <td className="text-center">{result.inventory.item.name}</td>
                            <td className="text-center">{result.quantity}</td>
                        </>
                        )}
                    </tr>
                    ))}

                    </tbody>
                </table>
                </div>               
                <button
                  onClick={() => handleSelectInquiry(inquiry)}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                >
                  Select
                </button>
              </div>
            ))}
          </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
    

    {/* inventor ymodal */}

    <dialog id="SelectInventory" className="modal">
    <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg">Select Reservation</h3>
        <p className="py-4"></p>
      
        <InventoryTable handleItemAdd={handleItemAdd} />
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
    {/* User Modal Content */}
    <dialog id="ChooseUser" className="modal">
              <div className="modal-box w-11/12 max-w-5xl h-full">
                <h3 className="font-bold text-lg">Users</h3>
                <UsersTable type={2} onSelectUser={handleSelectUser} />
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn btn-error">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
    </>
  )
}


export default TransactionRelease








