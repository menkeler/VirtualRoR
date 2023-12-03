import React, { useState, useEffect } from 'react';
import Navbar from '../../components/wholepage/Navbar';
import client from '../../api/client';
import Cookies from 'js-cookie';

const InquiryPage = () => {
const [InquiriesData, setInquiriesData] = useState([]);
    const [usersData, setUsersData] = useState([]);
    useEffect(() => {
      async function fetchData() {
        try {
          const authToken = Cookies.get('authToken');
          let url = 'transactions/inquiries/';
  
          const res = await client.get(url, {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          });

          const resuser = await client.get('users/userShowAll', {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          });
          
  
          console.log("Inquiry DATA",res.data);
          setInquiriesData(res.data); // Assuming the API response is an array of inventory items
          console.log("users DATA",resuser.data);
          setUsersData(resuser.data)
        } catch (error) {
          console.error('Error:', error);
        }
      }
  
      fetchData();
    }, []);

  return (
    <>
      <div>InquiryPage</div>
      <Navbar />
      <div>
        <h1>Inquiry page</h1>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Message</th>
                <th>Type</th>
                <th>Status</th>
                <th>User</th>
                <th>Preferred Date</th>
              </tr>
            </thead>
            <tbody>
              {InquiriesData.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td>{inquiry.id}</td>
                  <td>
                    <button
                      className="btn"
                      onClick={() => document.getElementById(`my_modal_${inquiry.id}`).showModal()}
                    >
                      View Message
                    </button>
                    <dialog id={`my_modal_${inquiry.id}`} className="modal">
                      <div className="modal-box">
                        <h3 className="font-bold text-lg">Message</h3>
                        <p className="py-4"> {inquiry.message}</p>
                      </div>
                      <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                      </form>
                    </dialog>
                  </td>
                  <td>{inquiry.inquiry_type}</td>
                  <td>{inquiry.status}</td>
                  {/* Find the user with the matching ID */}
                  <td>
                    {Array.isArray(usersData.users) ? (
                        usersData.users.map((userData) => (
                        userData.user_id === inquiry.user ?
                            `${userData.first_name} ${userData.last_name}` :
                            null
                        )).join('') || 'Unknown User'
                    ) : (
                        'Invalid User Data'
                    )}
                 </td>
                  <td>{inquiry.date_preferred}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default InquiryPage;

  