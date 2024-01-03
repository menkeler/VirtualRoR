import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import client from '../../api/client';

const EditItemProfileForm = ({ item, category, categoriesList, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    id: item.id,
    name: item.name,
    description: item.description,
    selectedCategory: { value: category.id, label: category.name }, // Set initial value as an object
  });
  
  const [editMode, setEditMode] = useState(false); 
  const { name, description, selectedCategory } = formData;

  const handleInputChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedCategory: selectedOption,
    }));
  };
  const handleEditButtonClick = () => {
    setEditMode((prevEditMode) => !prevEditMode);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const postData = {
      name: formData.name,
      description: formData.description,
      category: formData.selectedCategory.value,
    };

    try {
      console.log(postData);
      const response = await client.patch(`/inventory/item-profiling/${formData.id}/`, postData);
      console.log('Submission successful:', response.data);

      if (onSubmitSuccess && typeof onSubmitSuccess === 'function') {
        onSubmitSuccess();
      }
   
    
    // close the modal after submission
    document.getElementById(`EditItem${item.id}`).close();
    setEditMode(false);
  
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle duplicate name error (status code 400)
        alert('Error: Duplicate name. Please choose a different name.');
      } else {
        console.error('Error submitting donation:', error);
  
        // Handle other errors
        alert('Error: Something went wrong. Please try again later.');
      }
    }
    
    
    // Execute the callback function passed from the parent component
    
  };

  
  const resetForm = () => {
    setFormData((prevData) => ({
      ...prevData,
      selectedCategory: { value: category.id, label: category.name },
    }));
    setEditMode(false);
  };

  useEffect(() => { 
    // Call resetForm when the modal is closed
    const modalElement = document.getElementById(`EditItem${item.id}`);
    modalElement.addEventListener('close', resetForm);

    // Cleanup the event listener when the component unmounts
    return () => {
      modalElement.removeEventListener('close', resetForm);
    };
  }, [item, category]);

  return (
    <>
      <button className="btn" onClick={() => document.getElementById(`EditItem${item.id}`).showModal()}>
        Details
      </button>
      
      <dialog id={`EditItem${item.id}`} className="modal">
        <div className="modal-box h-full">
          <h3 className="font-bold text-lg">{item.name}!</h3>
          <figure>
                <img
                  src='https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg'
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
            </figure>
          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className={`mb-4 `}>
              <label htmlFor="name" className="text-lg font-bold mb-2">
                Name
              </label>
              {editMode ? (
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setFormData((prevData) => ({ ...prevData, name: e.target.value }))}
                  required
                  className={`border rounded-md p-2 w-full bg-white`}
                />
              ) : (
                <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, name: e.target.value }))}
                readOnly
                className={`border rounded-md p-2 bg-base-100 w-full`}
              />
              )}
            </div>

            {/* Description Textarea */}
            <div className={`mb-4 `}>
              <label htmlFor="description" className="text-lg font-bold mb-2">
                Description
              </label>
              {editMode ? (
              <textarea
                id="description"
                name="description"
                placeholder="Enter your description here..."
                value={description}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, description: e.target.value }))}
                required
                className={`border rounded-md p-2 w-full bg-white`}
                rows="4"
              ></textarea>
              ) : (
                <textarea
                id="description"
                name="description"
                placeholder="Enter your description here..."
                value={description}
                readOnly
                className={`border rounded-md p-2 w-full bg-base-100`}
                rows="4"
              ></textarea>
              )}
            </div>

            {/* Category Select */}
            <div className={`mb-4`}>
              <label htmlFor="selectedCategory" className="text-lg font-bold mb-2">
                Category
              </label>
              {editMode ? (
              <Select
                id="selectedCategory"
                name="selectedCategory"
                value={selectedCategory}
                onChange={handleInputChange}
                options={categoriesList.map((categoryOption) => ({
                  value: categoryOption.id,
                  label: categoryOption.name,
                }))}
                isSearchable
                required
                className={`border rounded-md p-2 w-full bg-white`}
              />
              ) : (
                <Select
                id="selectedCategory"
                name="selectedCategory"
                value={selectedCategory}
                onChange={handleInputChange}
                options={categoriesList.map((categoryOption) => ({
                  value: categoryOption.id,
                  label: categoryOption.name,
                }))}
                isSearchable
                required
                isDisabled
                className={`border rounded-md p-2 w-full bg-base-100`}
              />
              )}
            </div>
            <div className="flex justify-between">
            <div className="flex">
              {editMode && (
                <button type="submit" className="btn bg-accent text-white">
                  Confirm
                </button>
              )}
            </div>
            <div className="flex">
              <button type="button" onClick={handleEditButtonClick} className="btn bg-accent text-white">
                Edit
              </button>
              <button
                type="button"
                className="btn bg-gray-400 text-white ml-2"
                onClick={() => document.getElementById(`EditItem${item.id}`).close()}
              >
                Close
              </button>
            </div>
          </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default EditItemProfileForm;