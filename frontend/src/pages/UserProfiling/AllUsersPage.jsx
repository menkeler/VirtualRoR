import React, { useState, useEffect } from 'react';
import Navbar from '../../components/wholepage/Navbar';
import UsersTable from '../../components/Displaycomponents/UsersTable';
const AllUsersPage = () => {
  

  return (
    <>
      <Navbar />
      <UsersTable type = {1}/>
    </>
  );
};

export default AllUsersPage;