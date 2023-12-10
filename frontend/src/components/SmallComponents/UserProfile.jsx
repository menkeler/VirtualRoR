import React, { useState } from 'react';
import client from '../../api/client';
import useUserData from '../../hooks/useUserData';

const UserProfile = ({ userid }) => {
  const userIdToFetch = userid || useUserData()?.user_id;
  const userDataLogged = useUserData();
  const userData = useUserData(userIdToFetch);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    department: userData?.department || '',
    contact: userData?.contact || '',
    first_name: userData?.first_name || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setEditedData({
      department: userData?.department || '',
      contact: userData?.contact || '',
      first_name: userData?.first_name || '',
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedData({
      department: userData?.department || '',
      contact: userData?.contact || '',
      first_name: userData?.first_name || '',
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await client.put(`users/users/${userIdToFetch}/edit_user/`, editedData);
      setEditedData({
        department: response.data.department,
        contact: response.data.contact,
        first_name: response.data.first_name,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const makeProgramOfficer = async () => {
    try {
      await client.post(`users/users/${userIdToFetch}/become_staff/`);
    } catch (error) {
      console.error('Error setting as Program Officer:', error);
    }
  };

  const removeProgramOfficer = async () => {
    try {
      await client.delete(`users/users/${userIdToFetch}/remove_staff/`);
    } catch (error) {
      console.error('Error removing Program Officer status:', error);
    }
  };

  return (
    <>
      {/* Display Name */}
      <div>
        {isEditing ? (
          <>
            <label htmlFor="first_name">First Name:</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={editedData.first_name}
              onChange={handleInputChange}
            />
          </>
        ) : (
          userData ? (
            <div>Name: {userData.first_name} {userData.last_name}</div>
          ) : (
            'Loading...'
          )
        )}
      </div>

      {/* Display Department */}
      <div>
        {isEditing ? (
          <>
            <label htmlFor="department">Department: </label>
            <select
              id="department"
              name="department"
              value={editedData.department}
              onChange={handleInputChange}
            >
              <option value="Empty">Not Yet Added</option>
              <option value="CS">CS</option>
              <option value="Nursing">Nursing</option>
            </select>
          </>
        ) : (
          userData ? (
            <div>Department: {userData.department}</div>
          ) : (
            'Loading...'
          )
        )}
      </div>

      {/* Display Role */}
      <div>
        {userData ? (
          <div>
            Role: {userData?.staff?.position || 'Client'}

            {userDataLogged?.user.staff?.position === 'Director' &&
              userData?.staff?.position !== 'Director' && (
                <label htmlFor={`my_inner_modal_${userData.user_id}`} className="btn btn-accent">
                  Change Role
                </label>
              )
            }

            {/* Role Change Modal */}
            <input type="checkbox" id={`my_inner_modal_${userData.user_id}`} className="modal-toggle" />
            <div className="modal" role="dialog">
              <div className="modal-box">
                <h3 className="text-lg font-bold">Set Role For: {userData.first_name} {userData.last_name}</h3>

                <button className="btn btn-accent" onClick={makeProgramOfficer}>
                  Set to Program Officer
                </button>

                <button className="btn btn-accent" onClick={removeProgramOfficer}>
                  Remove Program Officer
                </button>
              </div>
              <label className="modal-backdrop" htmlFor={`my_inner_modal_${userData.user_id}`}>
                Close
              </label>
            </div>
          </div>
        ) : (
          'Loading...'
        )}
      </div>

      {/* Display Email */}
      <div>{userData ? <div>Email: {userData.email}</div> : 'Loading...'}</div>

      {/* Display Contact */}
      <div>
        {isEditing ? (
          <input
            type="text"
            name="contact"
            value={editedData.contact}
            onChange={handleInputChange}
          />
        ) : (
          userData ? `Contact: ${userData.contact}` : 'Loading...'
        )}
      </div>

      {/* Display Edit/Submit/Cancel buttons */}
      <div>
        {isEditing ? (
          <>
            <button className="btn btn-accent" onClick={handleSubmit}>
              Submit
            </button>
            <button className="btn btn-accent" onClick={cancelEdit}>
              Cancel
            </button>
          </>
        ) : (
          (userDataLogged?.user?.staff?.position === 'Director' || userDataLogged?.user.user_id === userData?.user_id) && (
            <button className="btn btn-accent" onClick={handleEdit}>
              Edit Profile
            </button>
          )
        )}
      </div>
    </>
  );
};

export default UserProfile;