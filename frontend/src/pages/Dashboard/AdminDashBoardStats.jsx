import React,{useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import client from '../../api/client';
import TransactionDetails from '../../components/Displaycomponents/TransactionDetails';
import InquiryDetails from '../../components/Displaycomponents/InquiryDetails';
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

  const [loading, setLoading] = useState(true);

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
        setLoading(false);
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
          <p className="text-sm mb-2">Department: {alldata.newestUsers.department}</p>
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
          <p className="text-sm mb-2">Department: {alldata.latestTransactions.participant.department}</p>
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
      <TransactionDetails fetchTransactions ={ fetchTransactions()}transaction={alldata.latestTransactions}/>
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
                    <p className="text-sm mb-2">Department: {alldata.latestInquiry.inquirer.department}</p>
                  </div>

                  <div className="text-right">
                            <p className="text-sm mb-2">ID: {alldata.latestInquiry.id} </p>
                            <p className="text-sm mb-2">Status: {alldata.latestInquiry.status} </p>
                    <p className="text-sm mb-2">Type: {alldata.latestInquiry.inquiry_type} </p>
                  </div>
              </div>
              <button className='btn btn-accent' onClick={()=>document.getElementById(`DetailInquiry${alldata.latestInquiry.id}`).showModal()}>View more</button>
          <InquiryDetails inquiry={alldata.latestInquiry}/>
      </div>        
</div>


)}



      </div>
    </section>



    </>
  )
}

export default AdminDashBoardStats











{/* 





                                 


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
            <div className="border-t border-gray-200 my-8"></div>

            <div className="flex flex-col w-full">
            <h3 className="font-bold text-lg mb-4">Transaction Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full mb-5 bg-white border border-gray-300">
        
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="py-2 px-4 border-b">Name</th>
                      <th className="py-2 px-4 border-b">Type</th>
                      <th className="py-2 px-4 border-b">Quantity/Condition</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
     
                  <tbody>
              
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                        <td className="py-2 px-4 border-b">
                          {item.inventory && item.inventory.item ? item.inventory.item.name : item.item.inventory.itemprofiling.item_name +" ID: " + item.item.id}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {item.item
                            ? 'Borrowable'
                            : 'Consumable'}
                        </td>
                        <td className={`py-2 px-4 border-b ${item.item && item.condition === 'Lost' ? 'bg-red-500' : ''}`}>
                          {item.item ? item.condition : item.quantity}
                        </td>
                  */}