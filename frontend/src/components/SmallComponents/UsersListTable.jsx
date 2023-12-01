import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import Cookies from 'js-cookie';
import UserProfile from './UserProfile';
const UsersListTable = () => {
  const [userData, setUserData] = useState(null);
  
  //FETCH DATA FOR ALL USERS ON BACKEND
  useEffect(() => {
    async function fetchData() {
      try {
        const authToken = Cookies.get('authToken');
        const res = await client.get('users/userShowAll', {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        setUserData(res.data);
        console.log(res.data);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchData();
  }, []);
  

return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
            {/* Check if userData.users exists before mapping */}
            {userData?.users &&
              userData.users.map((user) => (
                <tr key={user.user_id}>
                  {/* Add content for each row */}
                  <td>{user.user_id}</td> 
                  <td>{`${user.first_name} ${user.last_name}`}</td>
                  <td>{user.email}</td>
                  <td>{user.department}</td>
                  <td>{user.staff && user.staff.position ? user.staff.position : 'Client'}</td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => document.getElementById(`my_modal_${user.user_id}`).showModal()}>
                      Details
                    </button>
                    <dialog id={`my_modal_${user.user_id}`} className="modal">
                      <div className="modal-box flex flex-col items-center justify-center h-80%">
                        <div className="card w-96 bg-base-100 shadow-xl mb-4">
                          <figure>
                            {/* profile picture */}
                            <img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" />
                          </figure>
                          <div className="card-body">
                            <UserProfile userid={user.user_id} />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <button className="btn btn-accent">View Transaction</button>
                          <button className="btn btn-accent">View Inquiries</button>
                          <button className="btn btn-accent">View Posts</button>
                        </div>
                      </div>
                      <form method="dialog" className="modal-backdrop">
                        <button onClick={() => document.getElementById(`my_modal_${user.user_id}`).close()}>close</button>
                      </form>
                    </dialog>
                  </td>
                </tr>
              ))}
          </tbody>
      </table>
    </div>
  );
  
  
};

export default UsersListTable;
