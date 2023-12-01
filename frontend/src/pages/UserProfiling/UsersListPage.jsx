import React, { useState, useEffect } from 'react';
import Navbar from '../../components/wholepage/Navbar';
import client from '../../api/client';
import Cookies from 'js-cookie';
import useUserData from '../../hooks/useUserData';
import UsersListTable from '../../components/SmallComponents/UsersListTable';


function UsersList() {


return (
    <>
        <Navbar />
        <h1>TABLE OF USERS</h1>
        <UsersListTable />
    </>
);
}

export default UsersList;
