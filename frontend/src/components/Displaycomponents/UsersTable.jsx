import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Cookies from 'js-cookie';
import SemiCircleGauge from './SemiCircleGauge';
import { useAuth } from '../../contexts/AuthContext';
const UsersTable = ({ type, user, onSelectUser, onSelectType }) => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const {userData} = useAuth();

  const handleChangeRole = async (e, user_id, role) => {
    e.preventDefault();



    const userConfirmed = window.confirm(`Are you sure you want to change the role to ${role} for user ID: ${user_id}?`);

    if (!userConfirmed) {
      // User canceled the role change
      return;
    }
    try {
      if (role === 'student') {
        console.log('Changing role to student for user ID:', user_id);
        const response = await client.delete(`users/users/${user_id}/remove_staff/`);
        fetchUsers(currentPage);
        document.getElementById(`change_role_user_${user_id}`).close()
        
      } else {
        console.log('Changing role to staff for user ID:', user_id);
        const response = await client.post(`users/users/${user_id}/become_staff/`);
        fetchUsers(currentPage);
        document.getElementById(`change_role_user_${user_id}`).close()
      }
  


    } catch (error) {
      console.error('Error:', error);
   
    }
  };
  
  const fetchUsers = async (page) => {
    try {
      const authToken = Cookies.get('authToken');
      const encodedSearchQuery = encodeURIComponent(searchQuery);
      const response = await client.get(`users/users/?page=${page}&search=${encodedSearchQuery}`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      
      const { results, count } = response.data;

      setUsers(results);
      setTotalPages(Math.ceil(count / 30));

      // console.log(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setCurrentPage(1);
    }
  };
  useEffect(() => {
 

    fetchUsers(currentPage);
  }, [searchQuery, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const handleSelectUser = (userId) => {
      // Pass the selected user to the parent component
      onSelectUser(userId);
  };

  const handleSelectType = (type) => {
    // Pass the selected user to the parent component
    onSelectType(type);
};

  if (type === 1) {
      return (
        <>
     
          {/* Search bar */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="p-2 mb-4 border rounded-md"
          />
  
          {/* Table */}
          <div className="overflow-x-auto mx-16">
            <table className="table min-w-full bg-white border border-gray-300">
              {/* Head */}
              <thead className="bg-green-500 text-white">
                <tr>
                <th className="py-3 px-4 border-b w-20">User ID</th>
                <th className="py-3 px-4 border-b w-40">Name</th>
                <th className="py-3 px-4 border-b w-48">Email</th>
                <th className="py-3 px-4 border-b w-32">Department</th>
                <th className="py-3 px-4 border-b w-24">Role</th>
                <th className="py-3 px-4 border-b w-24 text-center">Trust Score</th>
                </tr>
              </thead>
             {/* Body */}
              <tbody>
              {users.map((user) => (
                <React.Fragment key={user.user_id}>
                  <tr className="hover:bg-green-50" onClick={() => document.getElementById(`Detail${user.user_id}`).showModal()}>
                    <td>{user.user_id}</td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg" alt="Avatar" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{user.first_name} {user.last_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">{user.department}</td>
                    <td className="py-2 px-4 border-b">
                      <span className="badge badge-info badge-lg">{user.staff && user.staff.position !== null ? user.staff.position : 'Client'}</span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="w-32 mx-auto">
                        <SemiCircleGauge value={650} type={"Table"}/>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
              </tbody>
            </table>

            {/* MOdal */}
            {users.map((user) => (
          <dialog key={`Detail${user.user_id}`} id={`Detail${user.user_id}`} className="modal">
           <div className="modal-box w-11/12 max-w-2xl p-6 bg-white shadow-md rounded-md">
            <div>
              <h3 className="font-bold text-xl mb-4">{`${user.first_name} ${user.last_name}`}</h3>
              <img  src={`https://randomuser.me/api/portraits/men/${user.user_id}.jpg`} alt="" className='mx-auto w-40 h-40  rounded-3xl mb-4' />
              <p className="text-gray-600 mb-2">
                <span className="font-bold">Department:</span> {user.department}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-bold">Role:</span> {user.staff && user.staff.position !== null ? user.staff.position : 'Client'}

                {/* change role button*/}
              
                {(!user.staff || (user.staff?.position !== 'Director')) && userData.user.staff?.position === 'Director' && (
                <button className="btn" onClick={() => document.getElementById(`change_role_user_${user.user_id}`).showModal()}>
                  ChangeRole
                </button>
              )}
           
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-bold">Email:</span> {user.email}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-bold">Contact:</span> {user.contact}
              </p>
           
                <span className="font-bold">Trust Score:</span> <SemiCircleGauge value={650}/>
               
           
             
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8">
              <button className="btn btn-info text-white p-2 rounded-full"    onClick={() => {
                  handleSelectUser(user);
                  onSelectType("transactions");
                }}>
                  View Transactions
              </button>
              <button className="btn btn-info text-white p-2 rounded-full"    onClick={() => {
                  handleSelectUser(user);
                  onSelectType("inquiries");
                }}>
                  View Inquiries
              </button>
              <button className="btn btn-info text-white p-2 rounded-full"    onClick={() => {
                  handleSelectUser(user);
                  onSelectType("posts");
                }}>
                  View Posts
              </button>
            </div>
          </div>
            <form method="dialog" className="modal-backdrop">
                  <button  >
                    Close
                  </button>
            </form>
          </dialog>
        ))}
      </div>
  
          {/* Pagination controls */}
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

            {/* Modals  */}
            {/* change role modal  */}
            {users.map((user) => (
        
            <dialog key={user.user_id} id={`change_role_user_${user.user_id}`} className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">Change User Role!</h3>
                    <button 
                    className="btn bg-blue-500 mr-2" 
                    onClick={(e) => handleChangeRole(e,user.user_id,"student")}
                    disabled={!user.staff}
                    
                    >Student</button>
                    <button 
                    className="btn bg-green-500" 
                    onClick={(e) => handleChangeRole(e,user.user_id,"staff")}
                    disabled={user.staff}
                    >Staff</button>
                    <div className="modal-action">
                      <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn">Close</button>
                      </form>
                    </div>
                  </div>
                </dialog>
           ))}
        </>
      );
    } else if (type === 2) {
      return (
          <>
          {/* Search bar */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
          />

         {/* List of names */}
        {/* <div className="mt-4 grid gap-4 grid-cols-3">
          {users.map((user) => (
            <div key={user.user_id} className="p-5 bg-white rounded-lg shadow-md">
              <h2 className="text-base font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap mb-2 text-truncate">
                {user.first_name} {user.last_name}
              </h2>
              <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg" alt="Avatar" />
                          </div>
                        </div>
              <p className="text-sm text-gray-600 overflow-hidden overflow-ellipsis whitespace-nowrap mb-2 text-truncate">
                {user.email}
              </p>
              <button
                onClick={() => handleSelectUser(user)}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
              >
                Select
              </button>
            </div>
          ))}
        </div> */}
        <div className="overflow-x-auto">
        <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.first_name} {user.last_name}</td>
              <td>{user.email}</td>
              <td>
                <button
                  onClick={() => handleSelectUser(user)}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                >
                  Select
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>


          {/* Pagination controls */}
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
      )

    } else {
      return null;
    }
}

export default UsersTable