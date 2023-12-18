import React, { useState } from 'react';
import Navbar from '../../components/wholepage/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import client from '../../api/client';

function UserProfilePage() {
  
  const {isLoggedIn, userData, fetchData } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: userData.user.first_name,
    department: userData.user.department,
    contact: userData.user.contact,
    // Add other fields you want to edit
  });

  // State for success message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      // Make a PUT request to update user data
      const res = await client.put(`users/users/${userData.user.user_id}/edit_user/`, formData);
      
      // Assuming the API request is successful, update the state and end the editing mode
      setFormData({
        first_name: res.data.first_name,
        department: res.data.department,
        contact: res.data.contact,
        
      });
  
      setEditing(false);
      await fetchData();

      // Display a success message
      setShowSuccessMessage(true);
      
      // Hide the success message after a few seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000); 

    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isLoggedIn) {
    // Redirect to login or handle non-logged-in state
    return <div>Please log in to view this page.</div>;
  }

  return (
    <>
      <Navbar />
      <h1 className="text-3xl font-bold text-center text-green-600 my-6">User Profile</h1>
      <div className="card card-side bg-base-100 shadow-xl">
        {/* Display user profile */}
        <figure><img src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg" alt="Movie"/></figure>
        <div className="card-body">
          {/* Display input fields or h2 based on editing state */}
          <h2 className="card-title">
            {editing ? (
              <>
                <label>
                  First Name:
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </label>
              </>
            ) : (
              <>Name: {userData.user.first_name} {userData.user.last_name}</>
            )}
          </h2>

          {/* Other fields */}
          <h2 className="card-title">Email: {userData.user.email}</h2>
          <h2 className="card-title">
            {editing ? (
              <label>
                Department:
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange} 
                >
                  <option value="CS">CS</option>
                  <option value="Nursing">Nursing</option>
                  {/* Add department options */}
                </select>
              </label>
            ) : (
              <>Department: {userData.user.department}</>
            )}
          </h2>
          <h2 className="card-title">
            {editing ? (
              <label>
                Contact:
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </label>
            ) : (
              <>Contact: {userData.user.contact}</>
            )}
          </h2>

          {/* Display Role */}
          <h2 className="card-title">
            Role: {userData.user.staff?.position || 'Client'}
          </h2>

          <div className="card-actions justify-end">
            {editing ? (
              <button onClick={handleSaveClick} className="btn btn-primary">
                Save
              </button>
            ) : (
              <button onClick={handleEditClick} className="btn btn-primary">
                Edit Profile
              </button>
            )}
          </div>

          {/* Display success message */}
          {showSuccessMessage && (
            <div role="alert" className="alert alert-success">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Your changes have been successfully saved!</span>
            </div>
          )}
        </div>
      </div>
      {/* end of card */}


    </>
  );
}

export default UserProfilePage;