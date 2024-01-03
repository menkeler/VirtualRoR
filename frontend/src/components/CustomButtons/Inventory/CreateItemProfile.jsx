import React, { useState, useEffect } from 'react';
import client from '../../../api/client';
import Cookies from 'js-cookie';
import Select from 'react-select';
import CategoryAdd from './CategoryAdd';
import EditCategoryForm from '../../Forms/EditCategoryForm';
import CategoryHook from '../../../hooks/CategoryHook';

const CreateItemProfile = ({onFormSubmit}) => {
  // Instead of single form use state i decided to use it like this more readable
  const {categoryData, loading, error, refetchCategory } = CategoryHook();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');

  const authToken = Cookies.get('authToken');


  // useEffect(() => {
  //   refetchCategory();
  // }, []);

  const handleFormSubmit = () => {

    // Refetch categories after form submission in categories
    refetchCategory();
    if (onFormSubmit) {
      onFormSubmit();
    }
    // console.log('Fetching categories',categoryData)
    // console.log('Form submitted. Fetching categories...');
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
      refetchCategory();
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
        <div className="modal-box w-11/12 max-w-1xl h-full p-6">
          <h3 className="font-bold text-lg mb-4">Item Profiling</h3>
          <form>
          <label htmlFor="item_name" className="text-sm">Name:</label>
            <div className="mb-4">
             
              <input type="text" id="item_name" value={itemName} onChange={(e) => setItemName(e.target.value)} className="input input-bordered w-full bg-white" />
            </div>
            <label htmlFor="itemType" className="text-sm">Item Type:</label>
            <div className="mb-4">
              
              <select id="itemType" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} className="select select-bordered w-full bg-white">
                <option value="" disabled>Select an option</option>
                <option value="true">Borrowable</option>
                <option value="false">Consumable</option>
              </select>
            </div>
            <label htmlFor="item_description" className="text-sm">Description:</label>
            <div className="mb-4 flex flex-col items-center">
             
              <textarea
                id="item_description"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                className="textarea textarea-bordered textarea-sm w-full bg-white"
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
              
                maxMenuHeight={200} 
              />
            </div>
            <div className="flex justify-between items-center mt-6">
             
                <button className="btn btn-accent mr-2" type='button' onClick={()=>document.getElementById('CategoryList').showModal()}>Categories</button>
              <div>
                <button className="btn btn-accent mr-4" onClick={handleSubmit} 
                 disabled={!itemName.trim() || !selectedOption || !itemDescription.trim() || !selectedCategory}

                >Add Item</button>
                <button className="btn btn-accent" type="button" onClick={() => { resetForm(); document.getElementById('ItemProfileModal').close(); }}>Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </dialog>
       {/* Categories Modal */}
       <dialog id="CategoryList" className="modal">
        <div className="modal-box w-11/12 max-w-5xl bg-white rounded-lg p-8">
        
        
          <h3 className="font-bold text-2xl mb-4">Categories</h3>
          <CategoryAdd onFormSubmit={handleFormSubmit} />
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

            {/* edit Category FOrm */}
            {categoryData.map((category) => (
              <div key={category.id} className="card bg-base-100 p-4 rounded-md shadow-lg">
                <h2 className="card-title text-3xl font-semibold overflow-hidden whitespace-nowrap">
                  {category.name}
                </h2>
                
                   <EditCategoryForm key={category.id} category={category} onFormSubmit={handleFormSubmit} />
              </div>
            ))}
          </div>

        <div className="modal-action mt-8">
          <form method="dialog">
            <button className="btn btn-secondary" onClick={() => document.getElementById('CategoryList').close()}>
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
      
    </>

    
  );
};

export default CreateItemProfile;