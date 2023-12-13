import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Cookies from 'js-cookie';
import Select from 'react-select';

const InventoryTable = ({type}) => {
  const [inventory, setInventory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categRes = await client.get('inventory/categories/');
        setCategoryData(categRes.data);
        // console.log('Categories:', categRes.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchItems = async (page,category) => {
      try {
        setIsFetching(true);
        const authToken = Cookies.get('authToken');
        const encodedSearchQuery = encodeURIComponent(searchQuery);


        const response = await client.get(`inventory/inventories/?page=${page}&search_category=${category}&search=${encodedSearchQuery}`, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        const { results, count } = response.data;

        setInventory(results);
        setTotalPages(Math.ceil(count / 30));

        // console.log(response.data);
        console.log(selectedCategory);
      } catch (error) {
        console.error('Error fetching items:', error);
        setCurrentPage(1);
      } finally {
        setIsFetching(false);
      }
    };

    
    fetchItems(currentPage,selectedCategory);
    fetchCategories();

  }, [searchQuery, currentPage, selectedCategory]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  if (type === 1) {
    return (
      <div className="container mx-auto p-4">
        
        {/* Search bar and Category Selector */}
        <div className="flex flex-wrap mb-4">
            {/* Search bar */}
            <div className="w-full sm:w-3/4 pr-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items..."
                className="border p-2 w-full"
              />
            </div>
    
            {/* Category Selector */}
            <div className="w-full sm:w-1/4">
              <Select
                value={selectedCategory}
                // IF SELECTED VALUE IS EMPTY WHICH IS ALL MAKE SELECTEDCATEGORY ""
                onChange={(selected) => setSelectedCategory(selected.value === "" ? "" : selected.label)}
                options={[
                  { value: "", label: "All" }, 
                  ...categoryData.map((category) => ({ value: category.id, label: category.name }))
                ]}
                isSearchable
                placeholder="Search or select category"
                className="select w-full"
                maxMenuHeight={200}
                isDisabled={isFetching}
              />
            </div>
        </div>
    
        {/* Selected Category */}
        <div className="mb-4">
          {selectedCategory && (
            <p className="font-bold text-lg">Selected Category: {selectedCategory}</p>
          )}
        </div>
    
        {/* Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {inventory.map((item) => (
            <div key={item.id} className="bg-white rounded-md shadow-md p-4">
              <figure>
                <img
                  src={item.item.image.te || 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg'}
                  alt={item.item.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              </figure>
              <div className="text-base">
                <h2 className="font-bold mb-2">
                  {item.item.name}
                  {item.item.returnable ? (
                    <span className="badge bg-blue-500 text-white ml-2">Borrowable</span>
                  ) : (
                    <span className="badge bg-gray-500 text-white ml-2">Consumable</span>
                  )}
                </h2>
                <p className="text-gray-600 mb-4">Description: {item.item.description}</p>
                <div className="flex justify-between items-center">
                  {item.item.category && (
                    <div className="badge bg-gray-200 text-gray-800">{item.item.category.name}</div>
                  )}
                  {item.item.returnable && (<button>ViewCopies</button>)}
                  
                </div>
              </div>
            </div>
          ))}
        </div>
    
        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isFetching}
          >
            « Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isFetching}
          >
            Next »
          </button>
        </div>
      </div>
    );
  }else if (type === 2) {
    null
  }else {
    null
  }
 
};

export default InventoryTable;