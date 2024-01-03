import React, { useState, useEffect } from 'react';
import client from '../../api/client';
const EditCategoryForm = ({ category, onFormSubmit }) => {
  const [editedValue, setEditedValue] = useState('');

  useEffect(() => {
    setEditedValue(category.name);
  }, [category]);

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    console.log('Saving edited value:', editedValue);
    const postData = {
      "name": editedValue
    };

    try {
      const response = await client.patch(`/inventory/categories/${category.id}/`, postData);
      
      // Check the response or handle it as needed
  
      document.getElementById(`Edit ${category.name}`).close();
      onFormSubmit(); // Notify the parent component to refetch categories
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
  };

  const handleCloseModal = () => {
    document.getElementById(`Edit ${category.name}`).close();
    onFormSubmit(); // Notify the parent component to refetch categories
  };

  return (
    <>
      <button className="btn" onClick={() => document.getElementById(`Edit ${category.name}`).showModal()}>
        Edit
      </button>
      <dialog id={`Edit ${category.name}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit: {category.name}</h3>
          <form>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs mb-4"
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
            />
            <div className="modal-action">
              <button type="button" className="btn btn-primary mr-2" onClick={handleCategorySubmit}>
                Save
              </button>
              <button
                type="button"
                className="btn"
                onClick={handleCloseModal}
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

export default EditCategoryForm;
