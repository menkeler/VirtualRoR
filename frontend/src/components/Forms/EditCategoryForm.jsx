import React, { useState, useEffect } from 'react';

const EditCategoryForm = ({ category, onFormSubmit }) => {
  const [editedValue, setEditedValue] = useState('');

  useEffect(() => {
    setEditedValue(category.name);
  }, [category]);

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    // Access the editedValue state to get the input value
    console.log('Saving edited value:', editedValue);
    // Close the modal
    document.getElementById(`Edit ${category.name}`).close();
    // Notify the parent component to refetch categories
    onFormSubmit();
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
                onClick={() => document.getElementById(`Edit ${category.name}`).close()}
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
