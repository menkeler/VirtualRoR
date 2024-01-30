import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Navbar from "../../components/wholepage/Navbar";
import { useAuth } from "../../contexts/AuthContext";
import client from "../../api/client";
import Footer from "../../components/wholepage/Footer";
import TransactionsTable from "../../components/Displaycomponents/TransactionsTable";
import InquiryTable from "../../components/Displaycomponents/InquiryTable";
function UserProfilePage() {
  const { isLoggedIn, userData, fetchData } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: userData.user.first_name,
    department: userData.user.department,
    contact: userData.user.contact,
  });
  //show success message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleEditClick = () => {
    setEditing(true);
  };

  // put date udpate user info
  const handleSaveClick = async () => {
    try {
      const res = await client.put(
        `users/users/${userData.user.user_id}/edit_user/`,
        formData
      );
      setFormData({
        first_name: res.data.first_name,
        department: res.data.department,
        contact: res.data.contact,
      });
      setEditing(false);
      await fetchData();
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Helmet>
        <title>My Profile - Virtual RoR</title>
      </Helmet>
      <Navbar />
      <div className="mx-4 md:mx-10 lg:mx-20 xl:mx-32">
        <h1 className="text-3xl font-bold text-center text-green-600 my-6">
          User Profile
        </h1>
        <div className="card card-side bg-base-100 shadow-xl">
          <figure>
            <img
              src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
              alt="Movie"
              className="h-52 w-52 rounded-full mx-auto"
            />
          </figure>
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
                <>
                  Name: {userData.user.first_name} {userData.user.last_name}
                </>
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
                    <option value="CS">CS</option>
                    <option value="Nursing">Nursing</option>
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
            <h2 className="card-title">
              Role: {userData.user.staff?.position || "Client"}
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
              <summary className="collapse-title text-3xl font-medium">
                Transactions
              </summary>
              <div className="collapse-content">
                <TransactionsTable User={userData.user.user_id} />
              </div>
            </details>
          </div>

          <div className="mb-8">
            <details className="collapse bg-gray-100  rounded-lg  p-4 shadow-xl">
              <summary className="collapse-title text-3xl font-medium">
                Inquiries
              </summary>
              <div className="collapse-content">
                <InquiryTable User={userData.user.user_id} />
              </div>
            </details>
          </div>

          <div className="mb-8">
            <details className="collapse bg-gray-100  rounded-lg  p-4 shadow-xl">
              <summary className="collapse-title text-3xl font-medium">
                Posts
              </summary>
              <div className="collapse-content">Posts</div>
            </details>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserProfilePage;
