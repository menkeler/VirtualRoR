import React,{useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import client from '../../api/client';
const AdminDashBoardStats = () => {
  const [alldata, setAlldata] = useState({
    totalUsers: '',
    totalTransaction: '',
    newestUsers: '',
    latestTransactions: '',
    latestInquiry: '', 
    latestPost: '',
    lostAndBorrwedItems:'',
  });
  
  const endpoints = {
    totalUsers: 'users/users/total_users_count',
    totalTransaction: 'transactions/transactions/total_transactions/',
    newestUsers: '/users/users/newest_user/',
    latestTransactions: '/transactions/transactions/latest_transaction/',
    latestInquiry: '/transactions/inquiries/latest_inquiry/',
    latestPost: '/posts/posts/latest_post/',
    lostAndBorrwedItems:'/inventory/item-copies/get_borrowed_and_lost_items_count/',
  };

  //Map all endpounts and fetch data from each endpoints 
  const fetchData = async () => {
    const authToken = Cookies.get('authToken');
    try {
      if (authToken) {
        const dataPromises = Object.entries(endpoints).map(async ([key, endpoint]) => {
          const response = await client.get(endpoint, {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          });
          return [key, response.data];
        });
  
        const dataEntries = await Promise.all(dataPromises);
        const newData = Object.fromEntries(dataEntries);
  
        setAlldata((prevData) => ({ ...prevData, ...newData }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    console.log(alldata);
  }, [alldata]);

  return (
    <>

    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
      <div className="grid grid-cols-6 gap-4">
        {/* Registered Users */}
        <div className="col-span-1 stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Registered Users</div>
            <div className="stat-value">{alldata.totalUsers.total_users_count}</div>
            <div className="stat-desc">Users</div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="col-span-1 stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            </div>
            <div className="stat-title">Total Transactions</div>
            <div className="stat-value">{alldata.totalTransaction.total_transactions}</div>
            <div className="stat-desc">Transactions</div>
          </div>
        </div>

        {/* Borrowed Items */}
        <div className="col-span-1 stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            </div>
            <div className="stat-title">Borrowed Items</div>
            <div className="stat-value">{alldata.lostAndBorrwedItems.borrowed_items_count}</div>
            <div className="stat-desc">Borrowed</div>
          </div>
        </div>

          {/* Borrowed Items */}
          <div className="col-span-1 stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            </div>
            <div className="stat-title">Lost Items</div>
            <div className="stat-value">{alldata.lostAndBorrwedItems.lost_items_count}</div>
            <div className="stat-desc">Lost</div>
          </div>
        </div>

          {/* Borrowed Items */}
          <div className="col-span-1 stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            </div>
            <div className="stat-title">Blank</div>
            <div className="stat-value">{}</div>
            <div className="stat-desc">Blank</div>
          </div>
        </div>

        {/* Borrowed Items */}
        <div className="col-span-1 stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            </div>
            <div className="stat-title">Blank</div>
            <div className="stat-value">{}</div>
            <div className="stat-desc">Blank</div>
          </div>
        </div>

        <div className="divider col-span-6"></div> 
    {/* Card with col-span-5 */}
    <div className="col-span-2 card shadow bg-base-100">
      <h3 className="text-lg font-semibold mb-2">Newest User</h3>

      <div className="card-body bg-base-100">
        {/* Display data for the newest user */}
        <div className="flex items-center">
          <img
            className="rounded-full w-16 h-16 mr-4"
            src={alldata.newestUsers.avatar}
            alt="Avatar"
          />
          <div>
            <p className="text-sm mb-2">Name: {alldata.newestUsers.first_name} {alldata.newestUsers.last_name}</p>
            <p className="text-sm mb-2">Email: {alldata.newestUsers.email}</p>
            <p className="text-sm mb-2">Contact: {alldata.newestUsers.contact}</p>
            <p className="text-sm mb-2">Department: {alldata.newestUsers.department}</p>
       
          </div>
        </div>
      </div>
    </div>

    {/* Card with col-span-5 */}
    <div className="col-span-2 card shadow bg-base-100">
      <h3 className="text-lg font-semibold mb-2">Latest Transaction User</h3>

      <div className="card-body bg-base-100">
        {/* Display data for the newest user */}
        <div className="flex items-center">
    
          <div>
            <p className="text-sm mb-2">Kapoy Lagay sunod na Data</p>
         
      
          </div>
        </div>
      </div>
    </div>

    {/* Card with col-span-5 */}
    <div className="col-span-2 card shadow bg-base-100">
      <h3 className="text-lg font-semibold mb-2">Latest Inquiry </h3>

      <div className="card-body bg-base-100">
        {/* Display data for the newest user */}
        <div className="flex items-center">
        
          <div>
          <p className="text-sm mb-2">Kapoy Lagay sunod na Data</p>
          </div>
        </div>
      </div>
    </div>


      </div>
    </section>

    </>
  )
}

export default AdminDashBoardStats




