import React from 'react'

import useUserData from '../../hooks/useUserData'

const UserProfile = ({userid}) => {
    
    const userIdToFetch = userid || null;
    const userData = useUserData(userIdToFetch);
  
  return (
    <>
  
      <div>Name: {userData ? userData.user.first_name + " " + userData.user.last_name : 'Loading...'}</div>
      
      <div>Department: {userData ? userData.user.department : 'Loading...'}</div>

      <div>Role: {userData?.user?.staff?.position || 'Client'}</div>

      <div>{userData ? userData.user.email : 'Loading...'}</div>

      <div>Contact: {userData ? userData.user.contact : 'Loading...'}</div>

    </>
  )
}

export default UserProfile