import React from 'react';
import useUserData from '../../hooks/useUserData';
import UsersList from '../../pages/UserProfiling/UsersListPage';
import { Link } from 'react-router-dom';

const SecondaryNavBar = () => {
  const userData = useUserData();

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-end">
        <ul className="menu menu-horizontal px-1">
          <li><a>Inventory</a></li>
          <li><a>Transactions</a></li>
          <li><a>Inquiries</a></li>
          <li><a>Donation Board</a></li>
          {/* Only Displays if Director */}
          {userData && userData.user && userData.user.staff && (
            <li>
              <Link to="/alluserslist" className="justify-between">
                  Users
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SecondaryNavBar;

// only director
// {userData && userData.user && userData.user.staff && userData.user.staff.position.includes('Director') && (
//   <li>
//     <a href="#">Users</a>
//   </li>
// )}