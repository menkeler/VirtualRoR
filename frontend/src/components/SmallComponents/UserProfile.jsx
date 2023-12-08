import React,{useState} from 'react'
import client from '../../api/client';
import useUserData from '../../hooks/useUserData'

const UserProfile = ({userid}) => {
    
  const userIdToFetch = userid || useUserData()?.user_id;
  const userDataLogged = useUserData();
  const userData = useUserData(userIdToFetch);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
      department: userData?.department || '',
      contact: userData?.contact || '',
      first_name: userData?.first_name || '',
      
    });
    
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

      // Reset editedData
      setEditedData({
        department: userData?.department || '',
      contact: userData?.contact || '',
      first_name: userData?.first_name || '',
      });
  };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    
const handleSubmit = async () => {
  console.log('Submitting data:', editedData);

  try {
    const response = await client.put(`users/users/${userIdToFetch}/edit_user/`, editedData);
    // console.log('Server response:', response.data);

    // Update the local state with the updated data
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
    const response = await client.post(`users/users/${userIdToFetch}/become_staff/`);
    // console.log('Server response:', response.data);

  } catch (error) {
    console.error('Error setting as Program Officer:', error);
  }
};

const removeProgramOfficer = async () => {
  try {
    const response = await client.delete(`users/users/${userIdToFetch}/remove_staff/`);
    
  } catch (error) {
    console.error('Error removing Program Officer status:', error);
  }
};

    return (
      <>
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
            <div>
              Name: {userData.first_name} {userData.last_name}
            </div>
          ) : (
            'Loading...'
          )
        )}
      </div>
      {/* DEPARMENT */}
      <div>
        {isEditing ? (
          <>
            <label htmlFor="department">Department: </label>
            <input
              type="text"
              id="department"
              name="department"
              value={editedData.department}
              onChange={handleInputChange}
            />
          </>
        ) : (
          userData ? (
            <div>
              Department: {userData.department}
            </div>
          ) : (
            'Loading...'
          )
        )}
      </div>
    
      <div>
        {userData ? (
          <div>
            Role: {userData?.staff?.position || 'Client  '}

            {/* First Check if the Logged user is Director if Yes Then PRoceed to check the selected User from TAble 
            then If user is not the Director You are able to change the role of the user */}

            {userDataLogged?.user.staff?.position === 'Director' &&
              userData?.staff?.position !== 'Director' && (
                <label htmlFor={`my_inner_modal_${userData.user_id}`} className="btn btn-accent">
                  Change Role
                </label>
              )
            }
          
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
    
        <div>{userData ? userData.email : 'Loading...'}</div>
    
        <div>
          Contact: {isEditing ? (
            <input
              type="text"
              name="contact"
              value={editedData.contact}
              onChange={handleInputChange}
            />
          ) : (
            userData ? userData.contact : 'Loading...'
          )}
        </div>

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
}

export default UserProfile




