import React, { useState, useEffect } from 'react';
import client from '../../../api/client';
import Cookies from 'js-cookie';
import Select from 'react-select-virtualized';
import CategoryAdd from './CategoryAdd';

const CreateItemProfile = () => {
  // Instead of single form use state i decided to use it like this more readable
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');

  const authToken = Cookies.get('authToken');

  const fetchData = async () => {
    try {
      const categRes = await client.get('inventory/categories/');
      setCategoryData(categRes.data);
      console.log('Categories:', categRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const handleFormSubmit = () => {
    console.log('Form submitted. Fetching categories...');
    // Refetch categories after form submission in categories
    fetchData();
  };
  
  


  const handleSubmit = async (e) => {
    e.preventDefault();
  
   try {
      
       const data = {
        name: itemName,
        returnable: selectedOption === 'true',
        description: itemDescription,
        category: selectedCategory.value,
      };
  
      const res = await client.post('inventory/item-profiling/', data, {
        headers: { Authorization: `Token ${authToken}` },
      });
  
      console.log('Item added successfully:', res.data);
      resetForm();
      document.getElementById('ItemProfileModal').close();
    } catch (error) {
      console.error('Error adding item:', error);
      
    }
  };

  const resetForm = () => {
    setItemName('');
    setSelectedOption('');
    setItemDescription('');
    setSelectedCategory(null);
  };

  return (
    <>
      <button className="btn btn-accent mr-3" onClick={() => document.getElementById('ItemProfileModal').showModal()}>
        Create Item Profile
      </button>
      <dialog id="ItemProfileModal" className="modal">
        <div className="modal-box w-11/12 max-w-1xl p-6">
          <h3 className="font-bold text-lg mb-4">Item Profiling</h3>
          <form>
            <div className="mb-4">
              <label htmlFor="item_name" className="text-sm">Name:</label>
              <input type="text" id="item_name" value={itemName} onChange={(e) => setItemName(e.target.value)} className="input" />
            </div>
            <div className="mb-4">
              <label htmlFor="itemType" className="text-sm">Item Type:</label>
              <select id="itemType" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} className="select">
                <option value="" disabled>Select an option</option>
                <option value="true">Borrowable</option>
                <option value="false">Consumable</option>
              </select>
            </div>
            <div className="mb-4 flex flex-col items-center">
              <label htmlFor="item_description" className="text-sm">Description:</label>
              <textarea
                id="item_description"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                className="textarea textarea-bordered textarea-sm w-full max-w-xs"
                placeholder="Description"
              />
            </div>
            <div className="mb-4">
              <h1 className="text-lg font-semibold">Category</h1>
              <label className="text-sm">Select a category:</label>
              <Select
                value={selectedCategory}
                onChange={(selected) => setSelectedCategory(selected)}
                options={categoryData.map((category) => ({ value: category.id, label: category.name }))}
                isSearchable
                placeholder="Search or select category"
                className="select"
                maxMenuHeight={80} 
              />
            </div>
            <div className="flex justify-between items-center mt-6">
                <CategoryAdd onFormSubmit={handleFormSubmit}/>
              <div>
                <button className="btn btn-accent mr-4" onClick={handleSubmit}>Add Item</button>
                <button className="btn btn-accent" type="button" onClick={() => { resetForm(); document.getElementById('ItemProfileModal').close(); }}>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </dialog>
      
    </>
  );
};

export default CreateItemProfile;