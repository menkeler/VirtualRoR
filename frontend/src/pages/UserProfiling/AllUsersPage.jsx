import React, { useState, useEffect } from 'react';
import Navbar from '../../components/wholepage/Navbar';
import UsersTable from '../../components/Displaycomponents/UsersTable';
import DashboardInquiryPage from '../../pages/Dashboard/DashboardInquiryPage';
const AllUsersPage = ({ User, Type ,backUser}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  // handle selected user for transaction
  const handleSelectUser = (selectedUser) => {
  
    setSelectedUser(selectedUser);
    User(selectedUser); // Call the User function
  };

  const handleSelectType = (selectedType) => {
 
    setSelectedType(selectedType);
    Type(selectedType); // Call the Type function
  };

  return (
    <>
      <UsersTable type={1} onSelectUser={handleSelectUser} onSelectType={handleSelectType} />
      {/* <DashboardInquiryPage Admin={true}/> */}
    </>
  );
};

export default AllUsersPage;