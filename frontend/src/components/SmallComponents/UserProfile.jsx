import React,{useState} from 'react'
import client from '../../api/client';
import useUserData from '../../hooks/useUserData'

const UserProfile = ({userid}) => {
    
    const userIdToFetch = userid || null;
    const userDataLogged = useUserData();

    const userData = useUserData(userIdToFetch);

   
    
    
    const [isEditing, setIsEditing] = useState(false);
    
    const [editedData, setEditedData] = useState({
      department: userData?.user?.department || '',
      contact: userData?.user?.contact || '',
      first_name: userData?.user?.first_name || '',
      
    });
    
    const handleEdit = () => {
      setEditedData({
        department: userData?.user?.department || '',
        contact: userData?.user?.contact || '',
        first_name: userData?.user?.first_name || '',
      });
      setIsEditing(true);
    };

    const cancelEdit = () => {
      setIsEditing(false);

      // Reset editedData
      setEditedData({
        department: userData?.user?.department || '',
        contact: userData?.user?.contact || '',
        first_name: userData?.user?.first_name || '',
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
    const response = await client.put(`users/edit-user/${userIdToFetch}/`, editedData);
    console.log('Server response:', response.data);

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
    const response = await client.post(`users/become-staff/${userIdToFetch}/`);
    console.log('Server response:', response.data);

    // You may want to refetch user data after the change
  

  } catch (error) {
    console.error('Error setting as Program Officer:', error);
  }
};

const removeProgramOfficer = async () => {
  try {
    const response = await client.delete(`users/become-staff/${userIdToFetch}/`);
    

    // You may want to refetch user data after the change

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
              Name: {userData.user.first_name} {userData.user.last_name}
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
              Department: {userData.user.department}
            </div>
          ) : (
            'Loading...'
          )
        )}
      </div>
    
      <div>
        {userData ? (
          <div>
            Role: {userData?.user?.staff?.position || 'Client  '}

            {/* First Check if the Logged user is Director if Yes Then PRoceed to check the selected User from TAble 
            then If user is not the Director You are able to change the role of the user */}

            {userDataLogged?.user?.staff?.position === 'Director' &&
              userData?.user?.staff?.position !== 'Director' && (
                <label htmlFor={`my_inner_modal_${userData.user.user_id}`} className="btn btn-accent">
                  Change Role
                </label>
              )
            }
          
            {/* Put this part before </body> tag */}
            <input type="checkbox" id={`my_inner_modal_${userData.user.user_id}`} className="modal-toggle" />
            <div className="modal" role="dialog">
              <div className="modal-box">
                <h3 className="text-lg font-bold">Set Role For: {userData.user.first_name} {userData.user.last_name}</h3>


              <button className="btn btn-accent" onClick={makeProgramOfficer}>
                Set to Program Officer
              </button>

              <button className="btn btn-accent" onClick={removeProgramOfficer}>
                Remove Program Officer
              </button>

              </div>
              <label className="modal-backdrop" htmlFor={`my_inner_modal_${userData.user.user_id}`}>
                Close
              </label>
            </div>
          </div>
        ) : (
          'Loading...'
        )}
      </div>

    
    
        <div>{userData ? userData.user.email : 'Loading...'}</div>
    
        <div>
          Contact: {isEditing ? (
            <input
              type="text"
              name="contact"
              value={editedData.contact}
              onChange={handleInputChange}
            />
          ) : (
            userData ? userData.user.contact : 'Loading...'
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
          (userDataLogged?.user?.staff?.position === 'Director' && (
            <button className="btn btn-accent" onClick={handleEdit}>
              Edit Profile
            </button>
          ))
        )}
      </div>

      </>
    );
}

export default UserProfile




