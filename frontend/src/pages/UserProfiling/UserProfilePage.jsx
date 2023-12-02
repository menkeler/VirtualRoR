import React from 'react';
import Navbar from '../../components/wholepage/Navbar';
import UserProfile from '../../components/SmallComponents/UserProfile';
import useUserData from '../../hooks/useUserData'

function UserProfilePage() {
  const userData = useUserData();

  if (!userData) {
    return <div>Loading...</div>;
  }
  return (
    <div className="h-full bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center h-full">
        <div className="max-w-md w-full bg-white rounded-md p-8 shadow-md">
          <h1 className="text-3xl font-semibold mb-6">User Profile</h1>
          <div className="avatar">
            <div className="w-24 rounded">
              <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          <UserProfile userid={userData.user.user_id}/>
          {/* Add additional content or components here */}
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
