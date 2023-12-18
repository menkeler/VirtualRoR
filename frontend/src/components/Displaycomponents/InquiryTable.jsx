import React, { useState, useEffect } from 'react';
import client from '../../api/client';

const InquiryTable = () => {
  const [inquiries, setInquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchInquiries = async (page) => {
      try {
        const response = await client.get(`transactions/inquiries/?page=${page}`);
        console.log(response.data)
        const { results, count } = response.data;
        setInquiries(results);
        setTotalPages(Math.ceil(count / 50));
        
      } catch (error) {
        console.error('Error fetching inquiries:', error);
        setCurrentPage(1);
      }
    };

    fetchInquiries(currentPage);
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
            <th className="py-3 px-4 border-b">Inquiry ID</th>
            <th className="py-3 px-4 border-b">Name</th>
            <th className="py-3 px-4 border-b">Message</th>
            <th className="py-3 px-4 border-b">Type</th>
            <th className="py-3 px-4 border-b">Preferred Date</th>
            <th className="py-3 px-4 border-b text-center">Status</th>
            <th className="py-3 px-4 border-b">Actions</th>
            
            {/* Add more columns as needed */}
          </tr>
        </thead>
        {/* Body */}
        <tbody>
          {inquiries.map((inquiry) => (
            <tr key={inquiry.id} className="hover:bg-green-50">
              <td className="py-2 px-4 border-b ">{inquiry.id}</td>
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
              <td className={`py-2 px-4 border-b text-center ${inquiry.status === 'Accepted' ? 'bg-green-200' : 
                              inquiry.status === 'Rejected' ? 'bg-red-200' : 
                              inquiry.status === 'Cancelled' ? 'bg-yellow-200' : ''}`}>
                {inquiry.status}
              </td>
              {/* Add more cells as needed */}
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
};

export default InquiryTable;