import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; 
import client from '../../api/client';

const TransactionDetails = ({ transactionId, userId }) => {
const [transaction, setTransaction] = useState(null);
const [userData, setUser] = useState(null);
useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if transaction_id and user_id are not null or undefined
        if (transactionId !== null && transactionId !== undefined && userId !== null && userId !== undefined) {
          const authToken = Cookies.get('authToken');
  
          const resTransaction = await client.get(`transactions/transactions/${transactionId}/`, {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          });

          const resUser = await client.get(`/users/userProfile/${userId}/`, {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          });
  
          setTransaction(resTransaction.data);
          setUser(resUser.data) // Assuming the API response has a 'data' property
          console.log("FROM DETAILS",resTransaction.data);
          console.log("FROM Details Users",resUser.data);
        }
      } catch (error) {
        console.error('Error fetching transaction details:', error);
      }
    };
  
    fetchData();
  }, [transactionId, userId]);

  return (
    <>
     {/* Purpose For this Condition is to Prevent it from making uncessary API calls  Only get the data when The View details is click */}
        <>
          <h1>TRANSACTION DETAILS</h1>
          <br />
          <div className="flex w-full">
            <div className="grid h-80 flex-grow card bg-base-300 rounded-box place-items-center">
            <h1>Transaction NO: {transactionId}</h1>
            {transaction && (
            <>
                <h1>Date: {new Date(transaction.date_created).toLocaleDateString()}</h1>
                <h1>Transaction NO: {transaction.type}</h1>
                <h1>Status: {transaction.is_active ? 'Active' : 'Inactive'}</h1>
            </>
            )}
            </div>
            <div className="divider divider-horizontal">|</div>
            <div className="grid h-80 flex-grow card bg-base-300 rounded-box place-items-center">
            {userData && (
            <>
                <h1>Name: {userData.user.first_name}</h1>
                <h1>Course: {userData.user.department}</h1>
                <h1>Role: {userData?.user?.staff?.position || 'Client'}</h1>
                <h1>Email: {userData.user.email}</h1>
                <h1>Contact: {userData.user.contact}</h1>
            </>
            )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
              {transaction?.transaction_items?.map((item) => (
                    <tr key={item.id}>
                    <td>NameID for Now Becuz Tired: {item.inventory_item}</td>
                    <td>The Type also ID for Now Becuz Tired:{item.inventory_item}</td>
                    <td>N/A(Hard Coded For Now)</td>
                    <td>N/A(Hard Coded For Now)</td>
                    <td>All Consumables i will add the thigs for borrowables toLocaleDateString</td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        </>
    </>
  );
};

export default TransactionDetails;