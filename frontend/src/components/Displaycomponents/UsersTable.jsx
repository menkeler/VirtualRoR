import React, { useState, useEffect } from "react";
import client from "../../api/client";
import Cookies from "js-cookie";
import { useAuth } from "../../contexts/AuthContext";
import UserStatCounter from "../Displaycomponents/UserStatCounter"



const UsersTable = ({ type, user, onSelectUser, onSelectType }) => {
  const [users, setUsers] = useState([]);
  const [userDetail, setUserDetail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const { userData } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    contact: "",
    department: "",
  });
 
  const fetchData = async () => {
    try {
      const response = await client.get("users/departments/");
      console.log(response.data);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const showUserDetails = (userID) => {
    console.log('Showing details for user:', userID);
    
    // Set userDetail asynchronously
    setUserDetail(userID);
  };

  // useEffect hook to open modal when userDetail changes
  useEffect(() => {
    // Check if userDetail is truthy
    if (userDetail) {
      // Get the modal element
      const modal = document.getElementById(`userModalStat`);
      if (!modal) {
        console.error('Modal element not found');
        return;
      }

      // Attempt to open the modal
      try {
        modal.showModal();
      } catch (error) {
        console.error('Error opening modal:', error);
      }
    }
  }, [userDetail]);
  
  
  const openModal = (user) => {
    // Update the form data with the values from the clicked user
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      contact: user.contact,
      department: user.department ? user.department.id : null,
    });
    // Show the modal
    document.getElementById(`Detail${user.user_id}`).showModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e, user) => {
    e.preventDefault();
    // Here you can create the payload and handle the form submission
    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      contact: formData.contact,
      department: formData.department,
    };

    try {
      const res = await client.patch(`users/users/${user}/`, formData);
    } catch (error) {
      console.error("Error submitting form data:", error.response);
    }
    console.log("Form submitted with payload:", payload);
    setIsEditing(false);
    fetchUsers(currentPage);
  };

  const toggleEditing = () => {
    setIsEditing((prevState) => !prevState);
  };

  const handleChangeRole = async (e, user_id, role) => {
    e.preventDefault();

    const userConfirmed = window.confirm(
      `Are you sure you want to change the role to ${role} for user ID: ${user_id}?`
    );

    if (!userConfirmed) {
      // User canceled the role change
      return;
    }
    try {
      if (role === "student") {
        console.log("Changing role to student for user ID:", user_id);
        const response = await client.delete(
          `users/users/${user_id}/remove_staff/`
        );
        fetchUsers(currentPage);
        document.getElementById(`change_role_user_${user_id}`).close();
      } else {
        console.log("Changing role to staff for user ID:", user_id);
        const response = await client.post(
          `users/users/${user_id}/become_staff/`
        );
        fetchUsers(currentPage);
        document.getElementById(`change_role_user_${user_id}`).close();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchUsers = async (page) => {
    try {
      const authToken = Cookies.get("authToken");
      const encodedSearchQuery = encodeURIComponent(searchQuery);
      const response = await client.get(
        `users/users/?page=${page}&search=${encodedSearchQuery}`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      const { results, count } = response.data;

      setUsers(results);
      setTotalPages(Math.ceil(count / 30));

      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setCurrentPage(1);
    }
  };
  useEffect(() => {
    fetchUsers(currentPage);
  }, [searchQuery, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const handleSelectUser = (userId) => {
    // Pass the selected user to the parent component
    onSelectUser(userId);
  };

  const handleSelectType = (type) => {
    // Pass the selected user to the parent component
    onSelectType(type);
  };

  if (type === 1) {
    return (
      <>
        {/* Search bar */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="p-2 mb-4 border rounded-md"
        />

        {/* Table */}
        <div className="overflow-x-auto mx-16">
          <table className="table min-w-full bg-white border border-gray-300">
            {/* Head */}
            <thead className="bg-green-500 text-white">
              <tr>
                <th className="py-3 px-4 border-b w-20">User ID</th>
                <th className="py-3 px-4 border-b w-40">Name</th>
                <th className="py-3 px-4 border-b w-48">Email</th>
                <th className="py-3 px-4 border-b w-32">Department</th>
                <th className="py-3 px-4 border-b w-24">Role</th>
              </tr>
            </thead>
            {/* Body */}
            <tbody>
              {users.map((user) => (
                <React.Fragment key={user.user_id}>
                  <tr
                    className="hover:bg-green-50"
                    onClick={() => openModal(user)}
                  >
                    <td>{user.user_id}</td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
                              alt="Avatar"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">
                            {user.first_name} {user.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">
                      {user.department ? user.department.name : "None"}
                    </td>

                    <td className="py-2 px-4 border-b">
                      <span className="badge badge-info badge-lg">
                        {user.staff && user.staff.position !== null
                          ? user.staff.position
                          : "Client"}
                      </span>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* MOdal */}
          {users.map((user) => (
            <dialog
              key={`Detail${user.user_id}`}
              id={`Detail${user.user_id}`}
              className="modal"
            >
              <div className="modal-box w-11/12 max-w-2xl p-6 bg-white shadow-md rounded-md">
                <div>
                  <div className="relative">
                    {userData.user.staff?.position === "Director" && (
                      <button
                        className="btn btn-primary absolute top-0 right-0 m-4"
                        onClick={toggleEditing}
                      >
                        {isEditing ? "Close Edit" : "Edit"}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  {/* Conditionally render input fields if isEditing is true */}
                  {isEditing ? (
                    <>
                      <form onSubmit={(e) => handleFormSubmit(e, user.user_id)}>
                        <div className="flex flex-col space-y-2 items-center">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
                            alt=""
                            className="mx-auto w-40 h-40 rounded-3xl mb-4"
                          />
                          <p className="text-gray-600 mb-2">
                            <span className="font-bold">First Name:</span>{" "}
                            <input
                              type="text"
                              name="first_name"
                              value={formData.first_name}
                              onChange={handleInputChange}
                              className="input input-bordered  max-w-xs text-lg px-2 py-1"
                            />
                          </p>
                          <p className="text-gray-600 mb-2">
                            <span className="font-bold">Last Name:</span>{" "}
                            <input
                              type="text"
                              name="last_name"
                              value={formData.last_name}
                              onChange={handleInputChange}
                              className="input input-bordered  max-w-xs text-lg px-2 py-1"
                            />
                          </p>

                          <p className="text-gray-600 mb-2">
                            <span className="font-bold">Role:</span>{" "}
                            {user.staff && user.staff.position !== null
                              ? user.staff.position
                              : "Client"}
                            {/* change role button*/}
                            {(!user.staff ||
                              user.staff?.position !== "Director") &&
                              userData.user.staff?.position === "Director" && (
                                <button
                                  className="btn ml-2"
                                  onClick={() =>
                                    document
                                      .getElementById(
                                        `change_role_user_${user.user_id}`
                                      )
                                      .showModal()
                                  }
                                >
                                  ChangeRole
                                </button>
                              )}
                          </p>
                          <label>
                            Department:
                            <select
                              name="department"
                              value={formData.department}
                              onChange={handleInputChange}
                            >
                              {departments.map((department) => (
                                <option
                                  key={department.id}
                                  value={department.id}
                                >
                                  {department.name}
                                </option>
                              ))}
                            </select>
                          </label>
                          <p className="text-gray-600 mb-2">
                            <span className="font-bold">Email:</span>{" "}
                            {user.email}
                          </p>
                          <p className="text-gray-600 mb-2">
                            <span className="font-bold">Contact:</span>{" "}
                            <input
                              type="tel"
                              name="contact"
                              value={formData.contact}
                              onChange={handleInputChange}
                              pattern="[0-9]{11}"
                              maxLength="11"
                              className="input input-bordered  max-w-xs text-lg px-2 py-1"
                            />
                          </p>
                          <button type="submit" className="btn btn-primary">
                            Save
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <>
                      <h3 className="font-bold text-xl mb-4">{`${user.first_name} ${user.last_name}`}</h3>
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
                        alt=""
                        className="mx-auto w-40 h-40  rounded-3xl mb-4"
                      />
                      <p className="text-gray-600 mb-2">
                        <span className="font-bold">Department:</span>{" "}
                        {user.department ? user.department.name : "None"}
                      </p>
                      <p className="text-gray-600 mb-2">
                        <span className="font-bold">Role:</span>{" "}
                        {user.staff && user.staff.position !== null
                          ? user.staff.position
                          : "Client"}
                      </p>
                      <p className="text-gray-600 mb-2">
                        <span className="font-bold">Email:</span> {user.email}
                      </p>
                      <p className="text-gray-600 mb-2">
                        <span className="font-bold">Contact:</span>{" "}
                        {user.contact}
                      </p>
                    </>
                  )}
                </div>

                <div className="border-t border-gray-200 mt-6 pt-6">
                  <h4 className="font-bold text-xl mb-2">Additional Actions</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      className="btn btn-info text-white py-2 px-6 rounded-full"
                      onClick={() => {
                        handleSelectUser(user);
                        onSelectType("transactions");
                      }}
                    >
                      View Transactions
                    </button>
                    <button
                      className="btn btn-info text-white py-2 px-6 rounded-full"
                      onClick={() => {
                        handleSelectUser(user);
                        onSelectType("inquiries");
                      }}
                    >
                      View Inquiries
                    </button>
                    <button
                      className="btn btn-info text-white py-2 px-6 rounded-full"
                      onClick={() => {
                        handleSelectUser(user);
                        onSelectType("posts");
                      }}
                    >
                      View Posts
                    </button>
                  </div>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>Close</button>
              </form>
            </dialog>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="join mt-4">
          <button
            className="join-item btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            «
          </button>
          <button
            className="join-item btn"
            onClick={() => handlePageChange(currentPage)}
          >
            Page {currentPage} of {totalPages}
          </button>
          <button
            className="join-item btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>

        {/* Modals  */}
        {/* change role modal  */}
        {users.map((user) => (
          <dialog
            key={user.user_id}
            id={`change_role_user_${user.user_id}`}
            className="modal"
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg">Change User Role!</h3>
              <button
                className="btn bg-blue-500 mr-2"
                onClick={(e) => handleChangeRole(e, user.user_id, "student")}
                disabled={!user.staff}
              >
                Client
              </button>
              <button
                className="btn bg-green-500"
                onClick={(e) => handleChangeRole(e, user.user_id, "staff")}
                disabled={user.staff}
              >
                Staff
              </button>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        ))}
      </>
    );
  } else if (type === 2) {
    return (
      <>
        {/* Search bar */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
        />

        {/* List of names */}
        
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead class="text-slate-800 bg-slate-100">
              <tr>
                <th class="px-4 py-2">Name</th>
                <th class="px-4 py-2">Email</th>
                <th class="px-4 py-2">Action</th>
              </tr>
            </thead>

            <tbody className="text-slate-700">
  {users.map((user) => (
    <React.Fragment key={user.user_id}>
      <tr className="hover:bg-slate-200">
        <td className="px-4 py-2">
          {user.first_name} {user.last_name}
        </td>
        <td className="px-4 py-2">{user.email}</td>
        <td className="px-4 py-2">
          <button className="btn" onClick={() => showUserDetails(user.user_id)}>Details</button>
        </td>
      </tr>
      {userDetail && userDetail === user.user_id && (
  <dialog id={`userModalStat`} className="modal">
   <div className="modal-box w-11/12 max-w-5xl">
      <form method="dialog">
        {/* If there is a button in form, it will close the modal */}
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div className="flex flex-col items-center">
        <UserStatCounter user_ID={userDetail}/>
        <button
          onClick={() => {
            handleSelectUser(user);
            document.getElementById(`userModalStat`).close();
          }}
          className="px-3 py-1 bg-lime-500 text-white rounded hover:bg-lime-600 focus:outline-none focus:shadow-outline-lime active:bg-lime-700 mt-4"
        >
          Select
        </button>
      </div>
    </div>
  </dialog>
)}

    </React.Fragment>
  ))}
</tbody>

          </table>
        </div>
 

        {/* Pagination controls */}
        <div className="join mt-4">
          <button
            className="join-item btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            «
          </button>
          <button
            className="join-item btn"
            onClick={() => handlePageChange(currentPage)}
          >
            Page {currentPage} of {totalPages}
          </button>
          <button
            className="join-item btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </>
    );
  } else {
    return null;
  }
};

export default UsersTable;
