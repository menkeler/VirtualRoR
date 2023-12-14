import React from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Import the useAuth hook
import { Link } from 'react-router-dom';

const SecondaryNavBar = () => {
  const { isLoggedIn, userData } = useAuth(); // Use the useAuth hook to access authentication context

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="navbar-end">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/Inventory" className="justify-between">
                    Inventory
              </Link> 
            </li>
            <li>
              <Link to="/Transactions" className="justify-between">
              Transactions
              </Link> 
            </li>

            {/* Only Displays if Director */}
            {userData && userData.user && userData.user.staff && (
              <li>
                {/* Content to display if the user is a staff member */}
                <Link to="/Allusers" className="justify-between">
                    Users
                </Link> 
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SecondaryNavBar;


// only director
// {userData && userData.user && userData.user.staff && userData.user.staff.position.includes('Director') && (
//   <li>
//     <a href="#">Users</a>
//   </li>
// )}