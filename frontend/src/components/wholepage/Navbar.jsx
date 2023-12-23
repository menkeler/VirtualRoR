import React from 'react';
import LoginButton from './LoginButton';

import { Link, NavLink as RouterNavLink } from 'react-router-dom'; // Import RouterNavLink
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';


const Navbar = () => {
  const { isLoggedIn, userData } = useAuth();
  const {getTotalQuantity } = useCart();
  const NavLink = ({ to, children }) => (
    <RouterNavLink
      to={to}
      className="px-4 py-2 hover:bg-gray-200 transition duration-300 text-center"
    >
      {children}
    </RouterNavLink>
  );

  return (
    <>
      <div className='shadow-lg p-4 w-full'>
        <div className="navbar bg-neutral-100 w-full flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/Home" className="justify-between">
              <img
                alt="Tailwind CSS Navbar component"
                src="/public/Logo.png"
                className="w-100 h-16"
              />
            </Link>
          </div>

        {isLoggedIn && (
            <div className={`flex-1 px-64 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-${userData?.user?.staff ? 5 : 4} gap-4 justify-center`}>
              <NavLink to="/Home">
                Home
              </NavLink>
              <NavLink to="/Inventory">
                Inventory
              </NavLink>
              <NavLink to="/Transactions" >
                Transactions
              </NavLink>
              <NavLink to="/Inquiry" >
                Inquiry
              </NavLink>
              {userData?.user?.staff && (
                <NavLink to="/Allusers">
                  Users
                </NavLink>
              )}
            </div>
            
          )}
        
          {isLoggedIn ? (
            
            <div className="flex-none gap-2 flex items-center">
              <NavLink to="/Cart" >
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                  <div className="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <span className="badge badge-sm indicator-item">{getTotalQuantity()}</span>
                  </div>
                  <span className="text-sm font-semibold">Reserve</span>
                </div>
                
              </NavLink>
                
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="User Avatar" />
                  </div>
                </label>

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
                    <NavLink to="/profile" className="justify-between">
                      Profile
                    </NavLink>
                  </li>
                  {userData && userData.user && userData.user.staff && (
                    <li>
                      <NavLink to="/admin/dashboard" className="justify-between">
                        Admin Dashboard
                      </NavLink>
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
      </div>
    </>
  );
};

export default Navbar;