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
            />
    
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                {/* Head */}
                <thead className="bg-green-200">
                  <tr>
                    <th className="py-2 px-4 border-b">User ID</th>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Department</th>
                    <th className="py-2 px-4 border-b">Role</th>
                  </tr>
                </thead>
                {/* Body */}
                <tbody>
                  {users.map((user) => (
                    <React.Fragment key={user.user_id}>
                      <tr className="hover:bg-green-50">
                        <td className="py-2 px-4 border-b">{user.user_id}</td>
                        <td className="py-2 px-4 border-b">{user.first_name} {user.last_name}</td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">{user.department}</td>
                        <td className="py-2 px-4 border-b">{user.staff && user.staff.position !== null ? user.staff.position : 'Client'}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
    
            {/* Pagination controls */}
            <div className="join">
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
          <div className="mt-4 grid gap-4 grid-cols-6">
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