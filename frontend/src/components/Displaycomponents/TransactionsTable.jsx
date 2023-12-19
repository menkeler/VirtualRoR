import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Cookies from 'js-cookie';
import Select from 'react-select';

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTransactions = async (page) => {
      try {
        const response = await client.get(`transactions/transactions/?page=${page}`);
        console.log(response.data)
        const { results, count } = response.data;
        setTransactions(results);
        setTotalPages(Math.ceil(count / 30));
        
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setCurrentPage(1);
      }
    };

    fetchTransactions(currentPage);
  }, [currentPage]); // Empty dependency array to run the effect only once when the component mounts




  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  return (
    <>
      <div className="overflow-x-auto">
      <table className="table min-w-full bg-white border border-gray-300">
        {/* Head */}
        <thead className="bg-green-500 text-white">
          <tr>
            <th className="py-3 px-4 border-b">Transaction ID</th>
            <th className="py-3 px-4 border-b">User</th>
            <th className="py-3 px-4 border-b">Type</th>
            <th className="py-3 px-4 border-b">Remarks</th>
            
            <th className="py-3 px-4 border-b">Date Created</th>
            <th className="py-3 px-4 border-b text-center">Status</th>
            <th className="py-3 px-4 border-b text-center">Actions</th>
            
            {/* Add more columns as needed */}
          </tr>
        </thead>
        {/* Body */}
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-green-50">
              <td className="py-2 px-4 border-b">{transaction.id}</td>
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
              <td className="py-2 px-4 border-b">{new Date(transaction.date_created).toLocaleDateString()}</td>

              <td className={`py-2 px-4 border-b text-center ${!transaction.is_active ? 'bg-green-200' : ''}`}>
                {transaction.is_active ? 'Active' : 'Completed'}
              </td>
              <td className="py-2 px-2 border-b">
                <button className="btn btn-outline btn-info" onClick={() => document.getElementById(`Detail${transaction.id}`).showModal()}>Details</button>

                {/* MODAL */}
                  <dialog id={`Detail${transaction.id}`} className="modal">
                    <div className="modal-box">
                      
                      
                      <div className="flex w-full">
                        <div className="flex-grow card rounded-box place-items-center">
                          {/* Transaction Details */}
                          <h3 className="font-bold text-lg mb-4">Transaction Details</h3>
                          <div className="mb-2">{transaction.id}</div>
                          <div className="mb-2">{new Date(transaction.date_created).toLocaleDateString()}</div>
                          <div className="mb-2">{transaction.transaction_type}</div>
                          <div className="mb-2">
                          {transaction.is_active ? (
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full">Active</span>
                          ) : (
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full">Completed</span>
                          )}
                        </div>
                        </div>
                        <div className="flex items-center mx-4 text-gray-500"></div>
                        <div className="flex-grow card rounded-box place-items-center">
                          {/* User Details */}
                          <h3 className="font-bold text-lg mb-4">Client Details</h3>
                          <div className="mb-2">{transaction.participant.first_name} {transaction.participant.last_name}</div>
                          <div className="mb-2">{transaction.participant.department}</div>
                          <div className="mb-2">
                            {transaction.participant.staff ? transaction.participant.staff.position : 'Client'}
                          </div>
                          <div className="mb-2">{transaction.participant.email}</div>
                          <div className="mb-2">{transaction.participant.contact}</div>
                        </div>
                      </div>

                      <div className="flex flex-col w-full">
                      <h3 className="font-bold text-lg mb-4">Transaction Items</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white border border-gray-300">
                            {/* Head */}
                            <thead className="bg-gray-200">
                              <tr>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Type</th>
                                <th className="py-2 px-4 border-b">Quantity/Condition</th>
                              </tr>
                            </thead>
                            {/* Body */}
                            <tbody>
                              {/* Rows */}
                              {transaction.transaction_items.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                  <td className="py-2 px-4 border-b">
                                    {item.inventory && item.inventory.item ? item.inventory.item.name : item.item.inventory.itemprofiling.item_name}
                                  </td>
                                  <td className="py-2 px-4 border-b">
                                    {item.item
                                      ? 'Borrowable'
                                      : 'Consumable'}
                                  </td>
                                  <td className="py-2 px-4 border-b">
                                    {item.item ? item.item.condition : item.quantity}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="modal-action">
                        <form method="dialog">
                          <button className="btn" onClick={() => document.getElementById(`Detail${transaction.id}`).close()}>Close</button>
                        </form>
                      </div>
                    </div>
                  </dialog>

              </td>     
            </tr>
          ))}
        </tbody>
      </table>
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