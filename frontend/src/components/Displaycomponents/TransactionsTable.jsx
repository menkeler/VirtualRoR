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
                <button className="btn btn-outline btn-info mx-auto block">Details</button>
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