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
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');

  async function fetchData() {
    try {
      const authToken = Cookies.get('authToken');
      const categRes = await client.get('inventory/categories/');
      setcategoryData(categRes.data);
      console.log('Categories:', categRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

  const handleItemNameChange = (event) => {
    setItemName(event.target.value);
  };

  const handleItemDescriptionChange = (event) => {
    setItemDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const authToken = Cookies.get('authToken');
      const res = await client.post(
        'inventory/item-profiling/',
        {
          name: itemName,
          returnable: selectedOption === 'true',
          description: itemDescription,
          category: selectedCategory.value,
        },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
      console.log('Item added successfully:', res.data);

      // Reset form data after successful submission
      setItemName('');
      setSelectedOption('');
      setItemDescription('');
      setSelectedCategory(null);

      // Close the modal or perform other actions after successful submission
      document.getElementById('ItemProfileModal').close();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  return (
    <>
      <button className="btn btn-secondary" onClick={() => document.getElementById('ItemProfileModal').showModal()}>
        Add Item Profile
      </button>
      <dialog id="ItemProfileModal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Item Profiling</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="item_name">Name: </label>
              <input type="text" id="item_name" value={itemName} onChange={handleItemNameChange} />
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
              <input type="text" id="item_description" value={itemDescription} onChange={handleItemDescriptionChange} />
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
              <button className="btn btn-accent mr-4" type="submit">
                Add Item
              </button>
              <button className="btn btn-accent" onClick={() => document.getElementById('ItemProfileModal').close()}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default CreateItemProfile;