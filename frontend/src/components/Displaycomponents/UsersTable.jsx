  import React, { useState, useEffect } from 'react';
  import client from '../../api/client';
  import Cookies from 'js-cookie';

const UsersTable = ({ type, user, onSelectUser }) => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalPages, setTotalPages] = useState(1);
  
    useEffect(() => {
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
                    <th className="py-3 px-4 border-b">User ID</th>
                    <th className="py-3 px-4 border-b">Name</th>
                    <th className="py-3 px-4 border-b">Email</th>
                    <th className="py-3 px-4 border-b">Department</th>
                    <th className="py-3 px-4 border-b">Role</th>
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
                                {/* UPDATE IMAGES NEXT IME */}
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
                          <span className="badge badge-primary badge-lg">{user.staff && user.staff.position !== null ? user.staff.position : 'Client'}</span>
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
                <img src="https://randomuser.me/api/portraits/men/42.jpg" alt="" className='mx-auto w-40 h-40  rounded-3xl mb-4' />
                <p className="text-gray-600 mb-2">
                  <span className="font-bold">Department:</span> {user.department}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-bold">Role:</span> {user.staff && user.staff.position !== null ? user.staff.position : 'Client'}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-bold">Email:</span> {user.email}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-bold">Contact:</span> {user.contact}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <button className="btn btn-info text-white p-2 rounded">View Transactions</button>
                <button className="btn btn-info text-white p-2 rounded">View Inquiries</button>
                <button className="btn btn-info text-white p-2 rounded">View Posts</button>
              </div>

              <div className="modal-action mt-6">
                <form method="dialog">
                  <button className="btn" onClick={() => document.getElementById(`Detail${user.user_id}`).close()}>
                    Close
                  </button>
                </form>
              </div>
            </div>
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
          <div className="mt-4 grid gap-4 grid-cols-3">
            {users.map((user) => (
              <div key={user.user_id} className="p-5 bg-white rounded-lg shadow-md">
                <h2 className="text-base font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap mb-2 text-truncate">
                  {user.first_name} {user.last_name}
                </h2>
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