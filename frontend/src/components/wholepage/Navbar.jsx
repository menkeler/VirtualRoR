import React from 'react';
import LoginButton from './LoginButton';
import { Link, NavLink as RouterNavLink } from 'react-router-dom'; // Import RouterNavLink
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { isLoggedIn, userData } = useAuth();

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
            <div className={`flex-1 px-64 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-${userData?.user?.staff ? 4 : 3} gap-4 justify-center`}>
              <NavLink to="/Home">
                Home
              </NavLink>
              <NavLink to="/Inventory">
                Inventory
              </NavLink>
              <NavLink to="/Transactions" >
                Transactions
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