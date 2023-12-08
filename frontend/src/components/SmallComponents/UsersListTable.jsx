import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Cookies from 'js-cookie';
import UserProfile from './UserProfile';

const UsersListTable = () => {
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(''); // Add filter state
  const itemsPerPage = 1;

  // FETCH DATA FOR ALL USERS ON BACKEND
  useEffect(() => {
    async function fetchData() {
      try {
        const authToken = Cookies.get('authToken');
        const res = await client.get('users/users/', {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        setUserData(res.data.results);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchData();
  }, []);

  // Filter and search logic
  const filteredData = userData?.filter((user) => {
    const nameMatch = `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());
    const filterMatch = selectedFilter ? user.staff?.position === selectedFilter : true;
    return nameMatch && filterMatch;
  });

  // Calculate the indices of the items to display based on current page and items per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter selection change
  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  return (
    <div className="overflow-x-auto">
      {/* Add search and filter controls */}
      <div className="search-filter-controls">
        <input type="text" placeholder="Search by name" value={searchQuery} onChange={handleSearchChange} />
        <select value={selectedFilter} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="Program Officer">Program Officer</option>
          {/* Add more filter options as needed */}
        </select>
      </div>

      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* Check if currentItems exists before mapping */}
          {currentItems?.map((user) => (
            <tr key={user.user_id}>
              {/* Add content for each row */}
              <td>{user.user_id}</td>
              <td>{`${user.first_name} ${user.last_name}`}</td>
              <td>{user.email}</td>
              <td>{user.department}</td>
              <td>{user.staff && user.staff.position ? user.staff.position : 'Client'}</td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => document.getElementById(`my_modal_${user.user_id}`).showModal()}
                >
                  Details
                </button>
              <dialog id={`my_modal_${user.user_id}`} className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">User Details</h3>
                  <UserProfile userid={user.user_id} />
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="join">
        <button className="join-item btn" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          «
        </button>
        {/* Add buttons for each page */}
        {Array.from({ length: Math.ceil(filteredData?.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`join-item btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => paginate(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="join-item btn"
          onClick={() => paginate(Math.ceil(filteredData?.length / itemsPerPage))}
          disabled={currentPage === Math.ceil(filteredData?.length / itemsPerPage)}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default UsersListTable;