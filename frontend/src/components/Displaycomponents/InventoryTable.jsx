import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Cookies from 'js-cookie';
import Select from 'react-select';
import { useCart } from '../../contexts/CartContext';
import CategoryHook from '../../hooks/CategoryHook';


const InventoryTable = ({type}) => {
  const [inventory, setInventory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const { categoryData, loading, error, refetchCategory } = CategoryHook();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const { state, dispatch } = useCart();



  const addToCart = (inventoryId, itemName, itemId, maxquantity) => {
    // Check if the item with the same id already exists in the cart
    const itemExists = state.cartItems.some(item => item.inventory !== null && item.inventory === inventoryId);
    const copyExists = state.cartItems.some(item => item.item !== null && item.item === itemId);
  
    if (!itemExists && !copyExists) {
      const payload = {
        inventory: inventoryId,
        item: itemId,
        name: itemName,
        quantity: 1,
        maxquantity:maxquantity,
        // nextime add image here
      };
  
      dispatch({ type: 'ADD_TO_CART', payload });
    } else {
      console.log(`Item with id ${itemId} is already in the cart`);
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
      console.log(results)
      setInventory(results);
      setTotalPages(Math.ceil(count / 30));

      // console.log(response.data);
      // console.log(selectedCategory);
    } catch (error) {
      console.error('Error fetching items:', error);
      setCurrentPage(1);
    } finally {
      setIsFetching(false);
    }
  };


  useEffect(() => {
    fetchItems(currentPage,selectedCategory);
    refetchCategory();
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
                className="w-full bg-white"
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
                    <span className="badge bg-accent text-white ml-2">Consumable</span>
                  )}
                </h2>
                <p className="text-gray-600 mb-4">Description: {item.item.description}</p>
                <p className="text-gray-600 mb-4">Quantity: {item.quantity}</p>
               
                <div className="flex justify-between items-center">
                  {item.item.category && (
                    <div className="badge bg-info text-gray-800">{item.item.category.name}</div>
                  )}
                  {!item.item.returnable && item.quantity > 0 &&(<button className="btn btn-outline btn-primary" onClick={() => addToCart(item.id, item.item.name,null,item.quantity)}>Add to Cart</button>)}
                  { item.quantity <= 0 && (
                    <div className="py-4">
                      <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full uppercase text-xs font-semibold">
                        Out of stock
                      </span>
                    </div>
                  )}
                  {item.item.returnable && item.quantity > 0&&(<button className="btn btn-outline btn-info" onClick={() => document.getElementById(`Copiesof${item.id}`).showModal()}>View Copies</button>)}
                  
                  <dialog id={`Copiesof${item.id}`} className="modal">item
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">Item Copies</h3>
                      <p className="py-4">Available Copies</p>

                        {/* Display the item.item_copies in a list */}
                        <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                          {/* head */}
                          <thead className="bg-gray-200">
                            <tr>
                              <th className="py-2 px-4 border-b">ID</th>
                              <th className="py-2 px-4 border-b">Condition</th>
                              <th className="py-2 px-4 border-b">Status</th>
                              <th className="py-2 px-4 border-b"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* rows */}
                            {item.item_copies.map((copy, index) => (
                              <tr key={index} className={(index % 2 === 0) ? 'bg-gray-100' : ''}>
                                <td className="py-2 px-4 border-b">{copy.id}</td>
                                <td className="py-2 px-4 border-b">{copy.condition}</td>
                                <td className="py-2 px-4 border-b">
                                  {copy.is_borrowed ? (
                                    <span className="bg-red-500 text-white py-1 px-2 rounded-full">Borrowed</span>
                                  ) : (
                                    <span className="bg-green-500 text-white py-1 px-2 rounded-full">Available</span>
                                  )}
                                </td>
                                <td className="py-2 px-4 border-b">
                                {!copy.is_borrowed && (<button className="btn btn-outline btn-primary" onClick={() => addToCart(null, item.item.name + ' ID: ' + copy.id,copy.id,1)}>Add to Cart</button>
                               )}
                               </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        </div>
                      <div className="modal-action">
                        <form method="dialog">
                          <button className="btn" onClick={() => document.getElementById(`Copiesof${item.id}`).close()}>Close</button>
                        </form>
                      </div>
                    </div>
                  </dialog>
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