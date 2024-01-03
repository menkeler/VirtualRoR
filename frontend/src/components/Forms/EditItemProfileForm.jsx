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

  const { name, description, selectedCategory } = formData;

  const handleInputChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedCategory: selectedOption,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const postData = {
      name: formData.name,
      description: formData.description,
      category: formData.selectedCategory.value,
    };

    try {
      const response = await client.patch(`/inventory/item-profiling/${formData.id}/`, postData);
      console.log('Submission successful:', response.data);
    } catch (error) {
      console.error('Error submitting donation:', error);
    }
    
 


    // For testing purposes, you can close the modal after submission
    document.getElementById(`EditItem${item.id}`).close();
    // Execute the callback function passed from the parent component
    if (onSubmitSuccess && typeof onSubmitSuccess === 'function') {
      onSubmitSuccess();
    }
  };

  
  const resetForm = () => {
    setFormData({
      name: item.name,
      description: item.description,
      selectedCategory: { value: category.id, label: category.name },
    });
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
        Edit Item
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
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name here..."
                value={name}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, name: e.target.value }))}
                required
                className={`border rounded-md p-2 w-full bg-white`}
              />
            </div>

            {/* Description Textarea */}
            <div className={`mb-4 `}>
              <label htmlFor="description" className="text-lg font-bold mb-2">
                Description
              </label>
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
            </div>

            {/* Category Select */}
            <div className={`mb-4`}>
              <label htmlFor="selectedCategory" className="text-lg font-bold mb-2">
                Category
              </label>
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
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn bg-accent text-white">
                Submit
              </button>
              <button
                type="button"
                className="btn bg-gray-400 text-white ml-2"
                onClick={() => document.getElementById(`EditItem${item.id}`).close()}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default EditItemProfileForm;