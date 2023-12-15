import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Cookies from 'js-cookie';

const InventoryProfilingTable = ({onSelectItem}) => {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalPages, setTotalPages] = useState(1);
  
    useEffect(() => {
      const fetchItems = async (page) => {
        try {
          const authToken = Cookies.get('authToken');
          const encodedSearchQuery = encodeURIComponent(searchQuery);
          const response = await client.get(`inventory/item-profiling/?page=${page}&search=${encodedSearchQuery}`, {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          });
  
          const { results, count } = response.data;
  
          setItems(results);
          setTotalPages(Math.ceil(count / 20));
  
          // console.log(response.data);
        } catch (error) {
          console.error('Error fetching users:', error);
          setCurrentPage(1);
        }
      };
  
      fetchItems(currentPage);
    }, [searchQuery, currentPage]);
  
    const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    };
    const handleSelectItem = (itemId) => {

        onSelectItem(itemId);
      };



  return (
    <>
       
    {/* Search bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search Items..."
      />

    {/* List of names */}
        <div className="mt-4 grid gap-6 grid-cols-5">
            {items.map((item) => (
                <div key={item.id} className="p-6 bg-white rounded-lg shadow-md overflow-hidden">
                <h2 className="text-lg font-semibold overflow-wrap break-word whitespace-normal mb-2">
              {item.name}
            </h2>

            <figure>
                <img
                  src='https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg'
                  className="w-full h-16 object-cover rounded-md mb-4"
                />
            </figure>

            <p className="text-sm text-gray-600 whitespace-nowrap mb-2">
                {item.description}
            </p>

            {item.returnable ? (
            <span className="badge bg-blue-500 text-white ml-2">Borrowable</span>
            ) : (
            <span className="badge bg-green-500 text-white ml-2">Consumable</span>
            )}

            {/* Display additional information */}
            <p className="text-sm text-gray-500 mb-2">
                Category: {item.category.name}
            </p>
            {/* Add more details as needed */}
            <button
                onClick={() => handleSelectItem(item)}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
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
}

export default InventoryProfilingTable