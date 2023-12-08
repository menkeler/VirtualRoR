import React, { useState, useEffect } from 'react';
import client from '../../../api/client';
import Cookies from 'js-cookie';
import Select from 'react-select';

const CreateItemProfile = () => {
  useEffect(() => {
    fetchData();
  }, []);
  const [categoryData, setcategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  async function fetchData() {
    try {
      const authToken = Cookies.get('authToken');
      const res = await client.get('inventory/item-profiling/', {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      const itemRes = await client.get('inventory/item-profiling/');  
      const categRes = await client.get('inventory/categories/');
      setcategoryData(categRes.data);
      // Handle the response data here
      console.log('Item Profilings:', res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };
  return (
    <>
    <button className="btn btn-secondary" onClick={() => document.getElementById('ItemProfileModal').showModal()}>
      Add Item Profile
    </button>
    <dialog id="ItemProfileModal" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg">ItemProfiling</h3>
        <div>
          <label htmlFor="item_name">Name: </label>
          <input type="text" id="item_name"  />
        </div>
        <div>
            <label htmlFor="itemType">Item Type:</label>
            <select id="itemType" value={selectedOption} onChange={handleDropdownChange}>
              <option value="" disabled>Select an option</option>
              <option value="true">Borrowable</option>
              <option value="false">Consumable</option>
            </select>
          </div>
        <div>
          <label htmlFor="item_description">Description: </label>
          <input type="text" id="item_description"  />
        </div>
        <div>
      <h1>Category</h1>
      <label>Select a category:</label>
      <Select
        value={selectedCategory}
        onChange={handleCategoryChange}
        options={categoryData.map((category) => ({ value: category.id, label: category.name }))}
        isSearchable
        placeholder="Search or select category"
      />
      {selectedCategory && (
        <div>
          <p>Selected Category: {selectedCategory.label}</p>
          {/* You can display additional information about the selected category here */}
        </div>
      )}
    </div>
        <div className="flex justify-end mt-4">
          <button className="btn btn-accent mr-4">
            Add Item
          </button>
          <form method="dialog">
            <button className="btn btn-accent" onClick={() => document.getElementById('ItemProfileModal').close()}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </dialog>
  </>
    )
};

export default CreateItemProfile;
