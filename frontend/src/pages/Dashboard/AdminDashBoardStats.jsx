import React,{useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import client from '../../api/client';
const AdminDashBoardStats = () => {

const [totalUsers,setTotalUsers]= useState('')
const [totalTransaction,setTotalTransaction]= useState('')


  const fetchData = async () => {
    const authToken = Cookies.get('authToken');

    try {
      if (authToken) {
        const res = await client.get('users/users/total_users_count', {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        setTotalUsers(res.data.total_users_count)
        console.log('Total Users:', res.data);

        const resTotalTransaction = await client.get('transactions/transactions/total_transactions/');
        setTotalTransaction(resTotalTransaction.data.total_transactions);
        console.log('Total Transactions:', resTotalTransaction.data.total_transactions);




      }
    } catch (error) {
      console.error('Error fetching total users:', error);
    } 





  };

  useEffect(() => {
    fetchData();
  }, []);



  return (
    <>

             {/* User Statistics Section */}
             <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
              {/* Card Design for User Statistics */}
                <div className="stats shadow">

                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div className="stat-title">Registered Users</div>
                    <div className="stat-value">{totalUsers}</div>
                    <div className="stat-desc">Total Users </div>
                  </div>
                  
                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                    </div>
                    <div className="stat-title">Total Transactions</div>
                    <div className="stat-value">{totalTransaction}</div>
                  </div>
                  
                  {/* 
                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                    </div>
                    <div className="stat-title">Total Inquiries</div>
                    <div className="stat-value">1,200</div>
                  </div>

                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                    </div>
                    <div className="stat-title">Total Donations</div>
                    <div className="stat-value">1,200</div>
                  </div>
                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                    </div>
                    <div className="stat-title">Total Posts</div>
                    <div className="stat-value">1,200</div>
                  </div> */}


              </div>
            </section>


    </>
  )
}

export default AdminDashBoardStats