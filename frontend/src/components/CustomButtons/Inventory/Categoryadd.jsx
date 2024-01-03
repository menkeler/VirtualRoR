import React, { useState } from 'react';
import Cookies from 'js-cookie';
import client from '../../../api/client';

const CategoryAdd = ({onFormSubmit}) => {
  const [createdCategory, setCreatedCategory] = useState('');

  const handleCreateCategory = async (e) => {
    e.preventDefault();

      try {
      const authToken = Cookies.get('authToken');

      const res = await client.post('inventory/categories/', {
        name: createdCategory.trim().toLowerCase()
      }, {
        headers: { Authorization: `Token ${authToken}` },
      });

      console.log('Category created successfully:', res.data);

      // Clear input field
      setCreatedCategory('');

      // Close the modal
      document.getElementById('CreateCategory').close();

      if (onFormSubmit && typeof onFormSubmit === 'function') {
        onFormSubmit();
      }
    

    } catch (error) {
      console.error('Category creation failed. Please try again.', error);
    }
    // Add your logic for creating a category here

    // Close the modal after handling the category creation
    document.getElementById('CreateCategory').close();
    onFormSubmit()
  };

  return (
    <>
      <button className="btn btn-accent" type="button" onClick={() => document.getElementById('CreateCategory').showModal()}>
        Create Category
      </button>

      {/* CREATE CATEGORY MODAL */}
      <dialog id="CreateCategory" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create Category</h3>
          <div className="mb-4">
            <label htmlFor="categoryName" className="text-sm">
              Category Name:
            </label>
            <input type="text" id="categoryName" className="input" value={createdCategory} onChange={(e) => setCreatedCategory(e.target.value)} />
          </div>
          <div className="modal-action">
            <button className="btn btn-accent mr-4" type="button" onClick={handleCreateCategory}>
              Create Category
            </button>
            <button className="btn btn-accent" type="button" onClick={() => document.getElementById('CreateCategory').close()}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CategoryAdd;






