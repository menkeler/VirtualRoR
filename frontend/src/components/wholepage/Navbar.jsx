import React,{useState,useEffect} from 'react';
import LoginButton from './LoginButton';
import { Link } from 'react-router-dom';
import SecondaryNavBar from './SecondaryNavBar';
import { useAuth } from '../../contexts/AuthContext';
const Navbar = () => {
 
  const { isLoggedIn, userData } = useAuth(); 
    
  return (
    <>
      <div className="navbar bg-neutral-100 w-full">
        <div className="flex-1">
          <Link to="/home" className="justify-between">
            <img
              alt="Tailwind CSS Navbar component"
              src="/public/Logo.png"
              className="w-100 h-16"
            />
          </Link>
         
        </div>
        
        {isLoggedIn ? (
          
          <div className="flex-none gap-2">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
              </label>

               {/* Display FullNAme */} 
               <div className="ml-2">
                <h1 className="text-lg font-semibold text-gray-800">
                  {userData?.user && `${userData.user.first_name} ${userData.user.last_name}`}
                </h1>
                {userData?.user?.staff?.position && (
                  <p className="text-sm text-gray-500">
                    {userData.user.staff.position}
                  </p>
                )}
              </div>
              
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li>
                <Link to="/profile" className="justify-between">
                  Profile
                </Link>
                </li>
                {userData && userData.user && userData.user.staff && (
                  <li>
                    <Link to="/admin/dashboard" className="justify-between">
                      Admin Dashboard
                    </Link>
                  </li>
                )}
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
