import React,{useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import client from '../../api/client';
import TransactionDetails from '../../components/Displaycomponents/TransactionDetails';
import TransactionsHook from '../../hooks/TransactionsHook';
import InquiryDetails from '../../components/Displaycomponents/InquiryDetails';
const AdminDashBoardStats = () => {
  const [alldata, setAlldata] = useState({
    totalUsers: '',
    totalTransaction: '',
    newestUsers: '',
    latestTransactions: '',
    latestInquiry: '', 
    lostAndBorrwedItems:'',
  });

  

  const endpoints = {
    totalUsers: 'users/users/total_users_count',
    totalTransaction: 'transactions/transactions/total_transactions/',
    newestUsers: '/users/users/newest_user/',
    lostAndBorrwedItems:'/inventory/item-copies/get_borrowed_and_lost_items_count/',
    latestTransactions: '/transactions/transactions/latest_transaction/',
    latestInquiry: '/transactions/inquiries/latest_inquiry/',
  };

  const [loading, setLoading] = useState(true);

  //Map all endpounts and fetch data from each endpoints 
  const fetchData = async () => {
  const authToken = Cookies.get('authToken');
  try {
    if (authToken) {
      for (const [key, endpoint] of Object.entries(endpoints)) {
        try {
          const response = await client.get(endpoint, {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          });
          setAlldata((prevData) => ({
            ...prevData,
            [key]: response.data,
          }));
        } catch (error) {
          // console.error(`Error fetching data for ${key}:`, error);
        }
      }
      setLoading(false);
    }
  } catch (error) {
    // console.error('Error fetching data:', error);
  }
};

  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    // console.log(alldata);
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


        {alldata.newestUsers && (
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
          <p className="text-sm mb-2">Department: {alldata.newestUsers.departmentt ? alldata.newestUsers.department.name : 'None'}</p>

        </div>
      </div>
    </div>
  </div>
)}

{alldata.latestTransactions && (
  <div className="col-span-2 card shadow bg-base-100">
    <h3 className="text-lg font-semibold mb-2">Latest Transaction</h3>

    <div className="card-body bg-base-100">
      <div className="grid grid-cols-2 items-center">
        <div className="text-left">
          <p className="text-sm mb-2">User: {alldata.latestTransactions.participant.first_name} {alldata.latestTransactions.participant.last_name}</p>
          <p className="text-sm mb-2">Email: {alldata.latestTransactions.participant.email}</p>
          <p className="text-sm mb-2">Contact: {alldata.latestTransactions.participant.contact}</p>
          <p className="text-sm mb-2">Department: {alldata.latestTransactions.participant.department ? alldata.latestTransactions.participant.department.name : 'None'}</p>

        </div>

        <div className="text-right">
          <p className="text-sm mb-2">ID: {alldata.latestTransactions.id} </p>
          <p className="text-sm mb-2">
            Status: {alldata.latestTransactions.is_active ? 'Active' : 'Completed'}
          </p>
          <p className="text-sm mb-2">Type: {alldata.latestTransactions.transaction_type} </p>
        </div>
      </div>

      <button className='btn btn-accent' onClick={()=>document.getElementById(`Detail${alldata.latestTransactions.id}`).showModal()}>View more</button>
      <TransactionDetails fetchTransactions ={ fetchData} transaction={alldata.latestTransactions}/>
    </div>
  </div>
)}

{alldata.latestInquiry && (

  <div className="col-span-2 card shadow bg-base-100">
            <h3 className="text-lg font-semibold mb-2">Latest Inquiry</h3>

            <div className="card-body bg-base-100">
              
              <div className="grid grid-cols-2 items-center">
                  <div className="text-left">
                    <p className="text-sm mb-2">User: {alldata.latestInquiry.inquirer.first_name} {alldata.latestInquiry.inquirer.last_name}</p>
                    <p className="text-sm mb-2">Email: {alldata.latestInquiry.inquirer.email}</p>
                    <p className="text-sm mb-2">Contact: {alldata.latestInquiry.inquirer.contact}</p>
                    <p className="text-sm mb-2">Department: {alldata.latestInquiry.inquirer.department ? alldata.latestInquiry.inquirer.department.name : 'None'}</p>

                  </div>

                  <div className="text-right">
                            <p className="text-sm mb-2">ID: {alldata.latestInquiry.id} </p>
                            <p className="text-sm mb-2">Status: {alldata.latestInquiry.status} </p>
                    <p className="text-sm mb-2">Type: {alldata.latestInquiry.inquiry_type} </p>
                  </div>
              </div>
              <button className='btn btn-accent' onClick={()=>document.getElementById(`DetailInquiry${alldata.latestInquiry.id}`).showModal()}>View more</button>
          <InquiryDetails fetchData={fetchData} Admin={true} inquiry={alldata.latestInquiry}/>
      </div>        
</div>

)}
      </div>
    </section>
    </>
  )
}

export default AdminDashBoardStats

