import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Cookies from 'js-cookie';
import Select from 'react-select';

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectStatus, setSelectStatus] = useState('');
  
  
  const fetchTransactions = async (page) => {
    try {
      const response = await client.get(`transactions/transactions/?page=${page}`);
      // console.log(response.data)
      const { results, count } = response.data;
      setTransactions(results);
      setTotalPages(Math.ceil(count / 50));

      
      
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setCurrentPage(1);
    }
  };

  const handleConditionButtonClick = (condition) => {
    setSelectedCondition(condition);  
  };

  const handleselectStatus = (status) => {
    //if status is lost change the condition to lost
    if(status === "Lost"){
      setSelectedCondition('Lost')
    }else{
    //if selected status is lost and then change to returned reset condition for no error
      setSelectedCondition('')
    }

    setSelectStatus(status);  
  };



  const handleSubmit = async (e, itemId) => {
    e.preventDefault();
    
    if (selectStatus && selectedCondition) {
      try {
        if (selectStatus === "Returned") {
          const payload = {
            "status": "Returned",
            "return_date": new Date().toISOString().split('T')[0]
          };
  
          const Copypayload = {
            "condition": selectedCondition,
            "is_borrowed": false
          };
        
          const response = await client.patch(`transactions/transaction_items/${itemId.id}/`, payload);
          console.log('Transaction Item Updated:', response);
  
          const responseCopy = await client.put(`/inventory/item-copies/${itemId.item.id}/`, Copypayload);
          console.log('Item Copy Updated:', responseCopy);
        }
      } catch (error) {
        console.error('Error Accept:', error);
        console.error('Response Data:', error.response.data);
      }
  
      document.getElementById(`Update${itemId.item.id}`).close();
    }
  };
  



  useEffect(() => {
    fetchTransactions(currentPage);
    console.log('Selected',selectedCondition )
  }, [currentPage,selectedCondition]); 




  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  return (
    <>
  
{/* ---------------Table--------------- */}
      <div className="overflow-x-auto mx-16 mt-3">
      <table className="table min-w-full bg-white border border-gray-300">
        {/* Head */}
        <thead className="bg-green-500 text-white">
          <tr>
            <th className="py-3 px-4 border-b">Transaction ID</th>
            <th className="py-3 px-4 border-b">Date Created</th>
            <th className="py-3 px-4 border-b">User</th>
            <th className="py-3 px-4 border-b">Type</th>
            <th className="py-3 px-4 border-b">Remarks</th>
            <th className="py-3 px-4 border-b text-center">Status</th>
        
            
            {/* Add more columns as needed */}
          </tr>
        </thead>
        {/* Body */}
        <tbody>
          {transactions.map((transaction) => ( 
          <React.Fragment key={transaction.id}>
            <tr className="hover:bg-green-50" onClick={() => document.getElementById(`Detail${transaction.id}`).showModal()}>
              <td className="py-2 px-4 border-b">{transaction.id}</td>
              <td className="py-2 px-4 border-b">{new Date(transaction.date_created).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'medium' })}</td>

              <td className="py-2 px-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                              
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg" alt="Avatar" />
                    </div>
                  </div>
                    <div>
                      <div className="font-bold">{transaction.participant.first_name} {transaction.participant.last_name}</div>
                    </div>
                </div>
              </td>     
              <td className="py-2 px-4 border-b">{transaction.transaction_type}</td>     
              <td className="py-2 px-4 border-b">
                {transaction.remarks && transaction.remarks.length > 0
                  ? (transaction.remarks.length > 50
                    ? `${transaction.remarks.substring(0, 50)}...`
                    : transaction.remarks)
                  : 'No Remarks'}
              </td>
                    

              <td className={`py-2 px-4 border-b text-center ${transaction.is_active ? 'bg-green-300' : 'bg-yellow-200'}`}>
                {transaction.is_active ? 'Active' : 'Completed'}
              </td>   
            </tr>

            </React.Fragment>
          ))}
        </tbody>
      </table>
      {transactions.map((transaction) => (
        <dialog key={`Detail${transaction.id}`} id={`Detail${transaction.id}`} className="modal">
            <div className="modal-box w-11/12 max-w-5xl">                   
                      <div className="flex w-full">
                          {/* Transaction Details */}
                          <div className="flex-grow card rounded-box place-items-center p-6">
                            <h3 className="font-bold text-lg mb-4">Transaction Details</h3>
                            <div className="mb-2">ID: {transaction.id}</div>
                            <div className="mb-2">Date: {new Date(transaction.date_created).toLocaleDateString()}</div>
                            <div className="mb-2">Type: {transaction.transaction_type}</div>
                            <div className="mb-2">
                              {transaction.is_active ? (
                                <span className="bg-green-500 text-white px-2 py-1 rounded-full">Active</span>
                              ) : (
                                <span className="bg-yellow-500 text-white px-2 py-1 rounded-full">Completed</span>
                              )}
                            </div>
                          </div>
  
                          <div className="flex items-center mx-4 text-gray-500"></div>
  
                          {/* User Details */}
                          <div className="flex-grow card rounded-box place-items-center p-6">
                            <h3 className="font-bold text-lg mb-4">Client Details</h3>
                            <div className="mb-2">Name: {transaction.participant.first_name} {transaction.participant.last_name}</div>
                            <div className="mb-2">Department: {transaction.participant.department}</div>
                            <div className="mb-2">
                              Position: {transaction.participant.staff ? transaction.participant.staff.position : 'Client'}
                            </div>
                            <div className="mb-2">Email: {transaction.participant.email}</div>
                            <div className="mb-2">Contact: {transaction.participant.contact}</div>
                          </div>
                        </div>
                        <div className="flex flex-col w-full">
                        <h3 className="font-bold text-lg mb-4">Transaction Items</h3>
                          <div className="overflow-x-auto">
                            <table className="min-w-full mb-5 bg-white border border-gray-300">
                              {/* Head */}
                              <thead className="bg-gray-200">
                                <tr>
                                  <th className="py-2 px-4 border-b">Name</th>
                                  <th className="py-2 px-4 border-b">Type</th>
                                  <th className="py-2 px-4 border-b">Quantity/Condition</th>
                                  <th className="py-2 px-4 border-b">Actions</th>
                                </tr>
                              </thead>
                              {/* Body */}
                              <tbody>
                                {/* Rows */}
                                {transaction.transaction_items.map((item, index) => (
                                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                    <td className="py-2 px-4 border-b">
                                      {item.inventory && item.inventory.item ? item.inventory.item.name : item.item.inventory.itemprofiling.item_name +" ID: " + item.item.id}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                      {item.item
                                        ? 'Borrowable'
                                        : 'Consumable'}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                      {item.item ? item.item.condition : item.quantity}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                          {/* Modal for item udpates */}
                                          {item.status ==='Active' &&transaction.is_active &&(
                                            <>
                                                  
                                                    <button className="btn  btn-accent" onClick={()=> document.getElementById(`Update${item.item.id}`).showModal()}>Update</button>
                                                    <dialog id={`Update${item.item.id}`} className="modal">
                                                <div className="modal-box">
                                                <h3 className="font-bold text-lg">Return</h3>
                                                <div className="button-container">
                                                        <button
                                                          type="button"
                                                          className={`btn  mr-2 ${selectStatus === 'Returned' ? 'btn-accent selected' : 'btn'}`}
                                                          onClick={() => handleselectStatus('Returned')}
                                                        >
                                                          Returned
                                                        </button>
                                                        <button
                                                          type="button"
                                                          className={`btn  mr-2 ${selectStatus === 'Lost' ? 'btn-accent selected' : 'btn'}`}
                                                          onClick={() => handleselectStatus('Lost')}
                                                        >
                                                          Lost
                                                        </button>
                                                   
                                                  </div>
                                                  <h3 className="font-bold text-lg mb-5">Condition!</h3>

                                                  <h3 className="font-bold text-lg">Selected Condition:</h3>
                                                  <div className="button-container">
                                                    <button
                                                      type="button"
                                                      className={`btn  mr-2 ${selectedCondition === 'Acceptable' && selectStatus !== 'Lost' ? 'btn-accent selected' : 'btn'}`}
                                                      onClick={() => handleConditionButtonClick('Acceptable')}
                                                      disabled={selectStatus === 'Lost'}
                                                    >
                                                      Acceptable
                                                    </button>
                                                    <button
                                                      type="button"
                                                      className={`btn  mr-2 ${selectedCondition === 'Good' && selectStatus !== 'Lost' ? 'btn-accent selected' : 'btn'}`}
                                                      onClick={() => handleConditionButtonClick('Good')}
                                                      disabled={selectStatus === 'Lost'}
                                                    >
                                                      Good
                                                    </button>
                                                    <button
                                                      type="button"
                                                      className={`btn  mr-2 ${selectedCondition === 'Like new' && selectStatus !== 'Lost' ? 'btn-accent selected' : 'btn'}`}
                                                      onClick={() => handleConditionButtonClick('Like new')}
                                                      disabled={selectStatus === 'Lost'}
                                                    >
                                                      Like new
                                                    </button>
                                                    <button
                                                      type="button"
                                                      className={`btn mr-2 ${selectedCondition === 'Damaged' && selectStatus !== 'Lost' ? 'btn-accent selected' : 'btn'}`}
                                                      onClick={() => handleConditionButtonClick('Damaged')}
                                                      disabled={selectStatus === 'Lost'}
                                                    >
                                                      Damaged
                                                    </button>
                                                  </div>
                                                  
                                                  
                                                  <div className="modal-action">
                                                    <form method="dialog">                                                  
    
                                                        <button
                                                          className="btn btn-accent mr-2"
                                                          type="button"
                                                          onClick={(e) => handleSubmit(e, item)}
                                                        >
                                                          Submit
                                                        </button>
                                                                                                                                                         
                                                      <button className="btn">Close</button>
                                                    </form>
                                                  </div>
                                                </div>
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
                        <div className="flex flex-col w-full">
                        <div className="border rounded p-4 bg-gray-100">
                          <h3 className="font-bold text-lg mb-4">Remarks</h3>
                          <p className="text-gray-800">{transaction.remarks ? transaction.remarks:"No Remarks"}</p>
                        </div>
                        </div>
                        <div className="modal-action">
                          <form method="dialog">
                            <button className="btn" onClick={() => document.getElementById(`Detail${transaction.id}`).close()}>Close</button>
                          </form>
                        </div>
                      </div>
        </dialog>
      ))}
    </div>

    <div className="join mt-4">
            <button className="join-item btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                «
              </button>
              <button className="join-item btn" onClick={() => handlePageChange(currentPage)}>
                Page {currentPage} of {totalPages}
              </button>
              <button className="join-item btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                »
            </button>
    </div>
    </>
  );
}

export default TransactionsTable