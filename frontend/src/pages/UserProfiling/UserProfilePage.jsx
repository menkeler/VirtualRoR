import React, { useState, useEffect } from 'react';
import Navbar from '../../components/wholepage/Navbar';
import client from '../../api/client';
import Cookies from 'js-cookie';
import useUserData from '../../hooks/useUserData';
function UserProfilePage() {

  const userData = useUserData();

  return (
    <>
      <Navbar />
      <div>Name: {userData ? userData.user.first_name +" "+ userData.user.last_name  : 'Loading...'}</div>
      <div>Department: {userData ? userData.user.department : 'Loading...'}</div>
      <div>Role: {userData?.user?.staff?.position || 'Client'}</div>
      <div>{userData ? userData.user.email : 'Loading...'}</div>
      <div>Contact: {userData ? userData.user.contact : 'Loading...'}</div>

    </>
  );
}

export default UserProfilePage;
