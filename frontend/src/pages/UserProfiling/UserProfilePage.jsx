import React, { useState,useEffect } from 'react';
import Navbar from '../../components/wholepage/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import client from '../../api/client';
import Footer from '../../components/wholepage/Footer';
import TransactionsTable from '../../components/Displaycomponents/TransactionsTable';
import InquiryTable from '../../components/Displaycomponents/InquiryTable';
function UserProfilePage() {
  const { isLoggedIn, userData, fetchData } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: userData.user.first_name,
    department: userData.user.department ? userData.user.department.id : "none",
    // Store department ID
    contact: userData.user.contact,
  });
  
  const [departments, setDepartments] = useState([]);
  //show success message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleEditClick = () => {
    setEditing(true);
  };
  const getDepartments = async () => {
    try {
      const response = await client.get("users/departments/");
      console.log(response.data);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };
  useEffect(() => {
    getDepartments();
  }, []);
  // put date udpate user info
  const handleSaveClick = async () => {
    try {
      console.log("form",formData)
      const res = await client.patch(`users/users/${userData.user.user_id}/`, formData);
      setFormData({
        first_name: res.data.first_name,
        department: res.data.department.id, 
        contact: res.data.contact,
      });
     
      setEditing(false);
      await fetchData();
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

    } catch (error) {
      console.error('Error submitting form data:', error.response); 
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  
  };
  


  return (
    <>
      <Navbar />
      <div className="mx-4 md:mx-10 lg:mx-20 xl:mx-32">
        <h1 className="text-3xl font-bold text-center text-green-600 my-6">User Profile</h1>
        <div className="card card-side bg-base-100 shadow-xl">
          <figure><img  src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg" alt="Movie" className='h-52 w-52 rounded-full mx-auto'/></figure>
          <div className="card-body">
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
            
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>

                </label>
              ) : (
                <> 
                  Department: {userData.user.department ? userData.user.department.name : 'None'}
                </>
 
   
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

            {showSuccessMessage && (
              <div role="alert" className="alert alert-success">
                <span>Your changes have been successfully saved!</span>
              </div>
            )}
          </div>
        </div>

        <div className="container mx-auto p-4">
        <h1 className="text-3xl font-semibold mb-8">My Activities</h1>

        <div className="mb-8">
          <details className="collapse bg-gray-100  rounded-lg p-4 shadow-xl">
            <summary className="collapse-title text-3xl font-medium">Transactions</summary>
            <div className="collapse-content">
              <TransactionsTable User={userData.user.user_id} />
            </div>
          </details>
        </div>

        <div className="mb-8">
          <details className="collapse bg-gray-100  rounded-lg  p-4 shadow-xl">
            <summary className="collapse-title text-3xl font-medium">Inquiries</summary>
            <div className="collapse-content">
              <InquiryTable User={userData.user.user_id} />
            </div>
          </details>
        </div>

        <div className="mb-8">
          <details className="collapse bg-gray-100  rounded-lg  p-4 shadow-xl">
            <summary className="collapse-title text-3xl font-medium">Posts</summary>
            <div className="collapse-content">
              Posts
            </div>
          </details>
        </div>

      </div>
      </div>
      <Footer />
    </>
  );
}

export default UserProfilePage;