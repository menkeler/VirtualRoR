import React, { useState, useEffect } from 'react';
import Navbar from '../../components/wholepage/Navbar';
import client from '../../api/client';
import Cookies from 'js-cookie';
import TransactionDetails from '../../components/SmallComponents/TransactionDetails';
const TransactionPage = () => {
    //For the WHOle table to show all the data in the table
    const [transactionsData, setTransactionsData] = useState([]);
    const [usersData, setUsersData] = useState([]);
    //For the View Deatils for the modals
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);


    
    useEffect(() => {
      fetchData();
    }, []);
    //get data from backend
    async function fetchData() {
      try {
        const authToken = Cookies.get('authToken');

        const res = await client.get('transactions/transactions/', {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        const resuser = await client.get('users/users/', {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        

        // console.log("Transactions DATA",res.data);
        setTransactionsData(res.data); 
        // console.log("users DATA",resuser.data);
        setUsersData(resuser.data)
      } catch (error) {
        console.error('Error:', error);
      }
    }
    const handleTransactionsAdded = async () => {
      await fetchData();
    };
    const handleViewDetailsClick = (transactionId, userId) => {
        setSelectedTransaction(transactionId);
        setSelectedUser(userId);
      };

  return (
    <>
    <Navbar />
    <div>TransactionPage</div>
    
    <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Transaction No</th>
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactionsData.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{new Date(transaction.date_created).toLocaleDateString()}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.is_active ? 'Active' : 'Inactive'}</td>
                  <td>
                  <button className="btn" onClick={() => {
                                handleViewDetailsClick(transaction.id, transaction.user);
                                document.getElementById(`my_modal`).showModal();
                         }}>
                            View Details
                  </button>
                       <dialog id={`my_modal`} className="modal">
                        <div className="modal-box w-11/12 max-w-5xl">
                        <TransactionDetails
                            transactionId={selectedTransaction}
                            userId={selectedUser}
                        />
                         </div>
                         <form method="dialog" className="modal-backdrop">
                           <button>close</button>
                         </form>
                       </dialog>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
    </div>
    </>
  )
}

export default TransactionPage

