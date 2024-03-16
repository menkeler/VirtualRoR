  import React, { useState, useEffect } from 'react';
  import client from '../../api/client';
  import Cookies from 'js-cookie';
  import Select from 'react-select';
  import TransactionDetails from './TransactionDetails';

  import TransactionsHook from '../../hooks/TransactionsHook';
  const TransactionsTable = ({User,rerenderFlag }) => {
    const [selectedUserId, setSelectedUserId] = useState(User || '');
    
    const {
      transactions,
      currentPage,
      searchQuery,
      typeQuery,
      statusQuery,
      totalPages,
      handleStatusQuery,
      handleTypeQuery,
      handlePageChange,
      fetchTransactions, 
      setSearchQuery, 
    } = TransactionsHook(selectedUserId);

    useEffect(() => {
      fetchTransactions()
    }, [rerenderFlag]);
  
    return (
      <>
      <div role="tablist" className="tabs tabs-bordered mt-5 mb-1 bg-gray-200">
      <input
        type="radio"
        name="my_tabs_1"
        role="tab"
        className="tab"
        aria-label="All"
        checked={statusQuery === ''}
        onChange={() => handleStatusQuery('')}
      />
      <input
        type="radio"
        name="my_tabs_1"
        role="tab"
        className="tab"
        aria-label="Active"
        checked={statusQuery === 'true'}
        onChange={() => handleStatusQuery('true')}
      />
      <input
        type="radio"
        name="my_tabs_1"
        role="tab"
        className="tab"
        aria-label="Completed"
        checked={statusQuery === 'false'}
        onChange={() => handleStatusQuery('false')}
      />
      <select
        id="transactionType"
        name="my_tabs_1"
        role="tab"
        className="tab ml-4"
        aria-label="Select"
        value={typeQuery}
        onChange={(e) => handleTypeQuery(e.target.value)}
      >
        <option value="">All</option>
        <option value="Donation">Donation</option>
        <option value="Release">Release</option>
      </select>
        {/* Search bar */}

        {!User && (
            <input
              type="text"
              name="my_tabs_1"
              role="tab"
              value={searchQuery}
              aria-label="Search"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="tab text-left ml-4"
            />
            
        )}
       
      </div>
  {/* ---------------Table--------------- */}
        <div className="overflow-x-auto mt-3">
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
          <TransactionDetails fetchTransactions={fetchTransactions} key={`Detail${transaction.id}`} transaction={transaction}/>
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