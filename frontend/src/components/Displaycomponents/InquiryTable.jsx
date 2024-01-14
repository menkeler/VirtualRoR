import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import InquiryDetails from './InquiryDetails';
const InquiryTable = ({User,Admin}) => {
  const [inquiries, setInquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusQuery, setStatusQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeQuery, setTypeQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [weekValue, setWeekValue] = useState('');
  const {userData} = useAuth();

  const UserId = User ? User : '';


  useEffect(() => {
    fetchInquiries(currentPage, statusQuery,typeQuery);
  }, [currentPage,statusQuery,typeQuery,searchQuery]); // Empty dependency array to run the effect only once when the component mounts

  const fetchInquiries = async (
    page = currentPage,
    status = statusQuery,
    type = typeQuery
  ) => {
    try {
      const encodedSearchQuery = encodeURIComponent(searchQuery);
      const response = await client.get(`transactions/inquiries/?page=${page}&ordering=status&status=${encodeURIComponent(status)}&type=${encodeURIComponent(type)}&search=${encodedSearchQuery}&user=${UserId}`);
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



  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
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
        aria-label="Cancelled"
        checked={statusQuery === 'Cancelled'}
        onChange={(e) => handleStatusQuery(e, 'Cancelled')}
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
        className="tab ml-4"
        aria-label="Select"
        value={typeQuery}
        onChange={handleTypeQuery}
      >
        <option value="">All</option>
        <option value="Donation">Donation</option>
        <option value="Reservation">Reservation</option>
      </select>
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

    
      <div className=" overflow-x-auto">
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
            <tr className="hover:bg-green-50" onClick={() => document.getElementById(`DetailInquiry${inquiry.id}`).showModal()}>
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
          <InquiryDetails fetchData={fetchInquiries} key={`DetailInquiry${inquiry.id}`} Admin={Admin} inquiry={inquiry}/>
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