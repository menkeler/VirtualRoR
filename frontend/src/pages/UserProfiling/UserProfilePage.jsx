import React from 'react';
import Navbar from '../../components/wholepage/Navbar';
import UserProfile from '../../components/SmallComponents/UserProfile';

function UserProfilePage() {
  return (
    <div className="h-full bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center h-full">
        <div className="max-w-md w-full bg-white rounded-md p-8 shadow-md">
          <h1 className="text-3xl font-semibold mb-6">User Profile</h1>
          <UserProfile />
          {/* Add additional content or components here */}
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
