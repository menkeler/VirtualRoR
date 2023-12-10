import React, { useState, useEffect } from 'react';
import Navbar from '../../components/wholepage/Navbar';
import Cookies from 'js-cookie';
import client from '../../api/client';

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1); // Assuming initial value of 1, update as needed

  useEffect(() => {
    const fetchUsers = async (page = 1) => {
      try {
        const authToken = Cookies.get('authToken');
        const encodedSearchQuery = encodeURIComponent(searchQuery); 
        const response = await client.get(`users/users/?page=${page}&search=${encodedSearchQuery}`, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
  
        // Assuming your response contains both the data and pagination information
        const { results, count } = response.data;
  
        setUsers(results);
        setTotalPages(Math.ceil(count / 30));
  
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    // Reset current page to 1 when the search query changes
    setCurrentPage(1);
  
    fetchUsers(1); 
  }, [searchQuery]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <Navbar />
      <div>AllUsersPage</div>

      {/* Search bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search users..."
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table">
          {/* Head */}
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
            </tr>
          </thead>
          {/* Body */}
          <tbody>
            {users.map((user) => (
                <React.Fragment key={user.user_id}>
                <tr className="hover">
                    <th>{user.user_id}</th>
                    <td>{user.first_name} {user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{user.department}</td>
                    <td>{user.staff && user.staff.position !== null ? user.staff.position : 'Client'}</td>
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
};

export default AllUsersPage;