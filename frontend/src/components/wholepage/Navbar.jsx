import React,{useState,useEffect} from 'react';
import LoginButton from './LoginButton';
import { Link } from 'react-router-dom';
import SecondaryNavBar from './SecondaryNavBar';
import useUserData from '../../hooks/useUserData';
import useAuth from '../../hooks/useAuth';
const Navbar = () => {
 
    const { isLoggedIn } = useAuth();
    const userData = useUserData();


  return (
    <>
      <div className="navbar bg-base-100 w-full">
        <div className="flex-1">
          <Link to="/home" className="justify-between">

            <img
              alt="Tailwind CSS Navbar component"
              src="public/Logo.png"
              style={{ maxWidth: '100px', maxHeight: '100%' }} 
            />
          </Link>
         
        </div>
        {isLoggedIn ? (
          
          <div className="flex-none gap-2">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" src='{userData.user.first_name}'/>
              </div>
              {/* Display FullNAme */}
              <h1>{userData && userData.user && `${userData.user.first_name} ${userData.user.last_name}`}</h1>
              {/* Display Postion if user has postion */}
              {userData && userData.user && userData.user.staff && userData.user.staff.position && (
                <h1>{userData.user.staff.position}</h1>
              )}

              </label>
              
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li>
                <Link to="/profile" className="justify-between">
                  Profile
                </Link>
                </li>
                <li> 
                    <LoginButton />
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex-2">
            <LoginButton />
          </div>
        )}
      </div>
      {isLoggedIn && <SecondaryNavBar className="w-full" />}

    </>
  );
};

export default Navbar;
