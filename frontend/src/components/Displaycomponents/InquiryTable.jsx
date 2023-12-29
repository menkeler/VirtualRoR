import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';

const InquiryTable = () => {
  const [inquiries, setInquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusQuery, setStatusQuery] = useState('Pending');
  const [typeQuery, setTypeQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [weekValue, setWeekValue] = useState('');
  const {userData} = useAuth();


  useEffect(() => {
    fetchInquiries(currentPage, statusQuery,typeQuery);
  }, [currentPage,statusQuery,typeQuery]); // Empty dependency array to run the effect only once when the component mounts

  const fetchInquiries = async (page,status,type) => {
    try {
      const response = await client.get(`transactions/inquiries/?page=${page}&ordering=status&status=${encodeURIComponent(status)}&type=${encodeURIComponent(type)}`);
      console.log(response.data);
      const { results, count } = response.data;
      setInquiries(results);
      setTotalPages(Math.ceil(count / 50));
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      setCurrentPage(1);
    }
  };
  const handleStatusQuery = function (e, status) {
    e.preventDefault();
    setStatusQuery(status);
  };
  const handleTypeQuery = function (e) {
    e.preventDefault();
    setTypeQuery(e.target.value);
  };

  const handleWeekChange = (selectedWeek) => {
    setWeekValue(selectedWeek);
  };

//to confirm inquiries donation and for reserving items
  const handleAccept = async (e, inquiryId,purpose) => {
    e.preventDefault();
  
    try {
      const response = await client.post(`transactions/confirm_reservation/${inquiryId}/${purpose}/`);
      fetchInquiries(currentPage, statusQuery,typeQuery);
      document.getElementById(`Detail${inquiryId}`).close()
      console.log('Submission successful:', response.data);

    } catch (error) {
      console.error('Error Accept:', error);
    }
  };


  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  return (
    <>
  

      <div role="tablist" className="tabs tabs-bordered mt-5 mx-16 bg-gray-200">
        <input
        type="radio"
        name="my_tabs_1"
        role="tab"
        className="tab"
        aria-label="All"
        checked={statusQuery === ''}
        onChange={(e) => handleStatusQuery(e, '')}
      />
        <input
        type="radio"
        name="my_tabs_1"
        role="tab"
        className="tab"
        aria-label="Pending"
        checked={statusQuery === 'Pending'}
        onChange={(e) => handleStatusQuery(e, 'Pending')}
      />
      <input
        type="radio"
        name="my_tabs_1"
        role="tab"
        className="tab"
        aria-label="Rejected"
        checked={statusQuery === 'Rejected'}
        onChange={(e) => handleStatusQuery(e, 'Rejected')}
      />
    
    
      <input
        type="radio"
        name="my_tabs_1"
        role="tab"
        className="tab"
        aria-label="Accepted"
        checked={statusQuery === 'Accepted'}
        onChange={(e) => handleStatusQuery(e, 'Accepted')}
      />
       <input
        type="radio"
        name="my_tabs_1"
        role="tab"
        className="tab"
        aria-label="Processed"
        checked={statusQuery === 'Processed'}
        onChange={(e) => handleStatusQuery(e, 'Processed')}
      />
    
      <select
        id="inquiryType"
        role="tab"
        className="tab"
        aria-label="Select"
        value={typeQuery}
        onChange={handleTypeQuery}
      >
        <option value="">All</option>
        <option value="Donation">Donation</option>
        <option value="Reservation">Reservation</option>
      </select>
    </div>
    
  {/* WEEK SELECTOR */}
    {/* <input
      type="week"
      name="weekSelector"
      role="tab"
      className="tab"

      value={weekValue} 
      onChange={(e) => handleWeekChange(e.target.value)}
    />
    
    */}

    
      <div className=" overflow-x-auto mx-16">
      <table className="table min-w-full bg-white border border-gray-300">
        {/* Head */}
        <thead className="bg-green-500 text-white">
          <tr>
            <th className="py-3 px-4 border-b">Inquiry ID</th>
            <th className="py-3 px-4 border-b">Date Created</th>
            <th className="py-3 px-4 border-b">Name</th>
            <th className="py-3 px-4 border-b">Message</th>
            <th className="py-3 px-4 border-b">Type</th>
            <th className="py-3 px-4 border-b">Preferred Date</th>
            <th className="py-3 px-4 border-b text-center">Status</th>
            
            {/* Add more columns as needed */}
          </tr>
        </thead>
        {/* Body */}
        <tbody>
          {inquiries.map((inquiry) => ( 
          <React.Fragment key={inquiry.id}>
            <tr className="hover:bg-green-50" onClick={() => document.getElementById(`Detail${inquiry.id}`).showModal()}>
              <td className="py-2 px-4 border-b ">{inquiry.id}</td>
              <td className="py-2 px-4 border-b">{new Date(inquiry.date_created).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'medium' })}</td>

              
              <td className="py-2 px-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                                {/* UPDATE IMAGES NEXT IME */}
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg" alt="Avatar" />
                    </div>
                  </div>
                    <div>
                      <div className="font-bold">{inquiry.inquirer.first_name} {inquiry.inquirer.last_name}</div>
                    </div>
                </div>
              </td>          
              <td className="py-2 px-4 border-b">{inquiry.message.length > 50 ? `${inquiry.message.substring(0, 50)}...` : inquiry.message}</td>
              <td className="py-2 px-4 border-b">{inquiry.inquiry_type}</td>
              <td className="py-2 px-4 border-b">{inquiry.date_preferred}</td>
              <td className={`py-2 px-4 border-b text-center ${inquiry.status === 'Pending' ? 'bg-gray-200' : 
                              inquiry.status === 'Rejected' ? 'bg-red-200' : 
                              inquiry.status === 'Cancelled' ? 'bg-yellow-200' : 
                              inquiry.status === 'Accepted' ? 'bg-green-200' : 
                              inquiry.status === 'Processed' ? 'bg-blue-200' : 
                              ''}`}>
                {inquiry.status}
              </td>
            </tr>          
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* MOdal outside the table to avoid DOM NESTING */}
      {inquiries.map((inquiry) => (
        <dialog key={`Detail${inquiry.id}`} id={`Detail${inquiry.id}`} className="modal">
           {/* MODAL */}

                  <div className="modal-box w-11/12 max-w-5xl">
                    
                  <div className="flex w-full">
                      {/* Transaction Details */}
                      <div className="flex-grow card rounded-box place-items-center p-6">
                        <h3 className="font-bold text-lg mb-4">inquiry Details</h3>
                        <div className="mb-2">ID: {inquiry.id}</div>
                        <div className="mb-2">Date: {new Date(inquiry.date_created).toLocaleDateString()}</div>
                        <div className="mb-2">Type: {inquiry.inquiry_type}</div>
                        <div className="mb-2">
                        {inquiry.status && (
                          <span className={`px-2 py-1 rounded-full ${
                            inquiry.status === 'Pending' ? 'bg-gray-500 text-white' :
                            inquiry.status === 'Rejected' ? 'bg-red-500 text-white' :
                            inquiry.status === 'Cancelled' ? 'bg-yellow-500 text-white' :
                            inquiry.status === 'Accepted' ? 'bg-green-500 text-white' :
                            inquiry.status === 'Processed' ? 'bg-blue-500 text-white' :
                            ''
                          }`}>
                            {inquiry.status}
                          </span>
                        )}
                        </div>
                      </div>

                      {/* DVIDIER */}
                      <div className="flex items-center mx-4 text-gray-500"></div>

                      {/* User Details */}
                      <div className="flex-grow card rounded-box place-items-center p-6">
                        <h3 className="font-bold text-lg mb-4">Client Details</h3>
                        <div className="mb-2">Name: {inquiry.inquirer.first_name} {inquiry.inquirer.last_name}</div>
                        <div className="mb-2">Department: {inquiry.inquirer.department}</div>
                        <div className="mb-2">
                          Position: {inquiry.inquirer.staff ? inquiry.inquirer.staff.position : 'Client'}
                        </div>
                        <div className="mb-2">Email: {inquiry.inquirer.email}</div>
                        <div className="mb-2">Contact: {inquiry.inquirer.contact}</div>
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                    <h3 className="font-bold text-lg mb-4">Inquiry Items</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full mb-5 bg-white border border-gray-300">
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
                            {inquiry.reserved_items.map((item, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                <td className="py-2 px-4 border-b">
                                  {item.inventory && item.inventory.item ? item.inventory.item.name : item.item.inventory.itemprofiling.item_name + " ID:"+item.item.id }
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
                    <div className="flex flex-col w-full">
                    <div className="border rounded p-4 bg-gray-100">
                      <h3 className="font-bold text-lg mb-4">Message</h3>
                      <p className="text-gray-800">{inquiry.message ? inquiry.message:"No Remarks"}</p>
                    </div>
                    </div>
                    <div className="modal-action">
                      <form method="dialog">
                        {inquiry.status === 'Pending' &&(<button className="btn btn-accent mr-2 text-white" type='button' onClick={(e) => handleAccept(e, inquiry.id,"Accept")}>Accept</button>)}
                        {inquiry.status === 'Pending' &&(<button className="btn btn-error mr-2 text-white" type='button' onClick={(e) => handleAccept(e, inquiry.id,"Rejected")}>Reject</button>)}
                        <button className="btn bg-red-500 text-white" onClick={() => document.getElementById(`Detail${inquiry.id}`).close()}>Close</button>
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
};

export default InquiryTable;