import React, { useState } from "react";
import LoginButton from "./LoginButton";
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import CartPage from "../../pages/Transactions/CartPage";
const Navbar = () => {
  const { isLoggedIn, userData } = useAuth();
  const { getTotalQuantity } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const NavLink = ({ to, children }) => (
    <RouterNavLink
      to={to}
      className="text-gray-800 hover:text-green-500 font-medium focus:text-teal-700 px-3 py-1 rounded-full transition duration-300 "
    >
      {children}
    </RouterNavLink>
  );

  const MobileDropdown = () => (
    <div className="lg:hidden absolute top-16 left-0 bg-white p-4 flex flex-col border border-gray-300 shadow-md rounded-md z-50">
      <button
        className="block py-2 px-4 text-gray-800 hover:bg-gray-100 w-full font-bold bg-red-50 transition duration-300"
        onClick={toggleMobileMenu}
      >
        Close
      </button>
      <NavLink
        to="/Home"
        className="block py-2 px-4 text-gray-800 hover:bg-gray-100 transition duration-300"
      >
        Home
      </NavLink>
      <NavLink
        to="/Inventory"
        className="block py-2 px-4 text-gray-800 hover:bg-gray-100 transition duration-300"
      >
        Inventory
      </NavLink>
      <NavLink
        to="/profile"
        className="block py-2 px-4 text-gray-800 hover:bg-gray-100 transition duration-300"
      >
        Profile
      </NavLink>
      {userData?.user?.staff && (
        <NavLink
          to="/admin/dashboard"
          className="block py-2 px-4 text-gray-800 hover:bg-gray-100 transition duration-300"
        >
          Admin Dashboard
        </NavLink>
      )}
    </div>
  );

  return (
    <>
      <div className="shadow-lg bg-neutral-100 p-2 w-full sticky top-0 z-40">
        {/* Mobile Menu Toggle  ------------------------------------------------------------------*/}
        <div className="navbar bg-neutral-100 w-full flex items-center justify-between">
          <div>
            {isLoggedIn && (
              <div className="lg:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="px-4 py-2 text-gray-600 text-3xl hover:text-gray-800"
                >
                  ☰
                </button>
              </div>
            )}
            {/* Logo -------------------------------------------------------------------------------*/}
            <div className="flex items-center w-120 h-10">
              <Link to="/Home">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="/public/Logo.png"
                  className="aspect-[4/1] w-120 h-10 lg:min-w-120 lg:h-10" // Adjust the width and height based on your preference
                />
              </Link>
            </div>
          </div>

          {/* Mobile-friendly menu ---------------------------------------------------------------*/}
          {mobileMenuOpen && <MobileDropdown />}

          <div>
            {/* Desktop navigation links -----------------------------------------------------------*/}
            {isLoggedIn && (
              <div className={`lg:pr-10 lg:flex-row lg:gap-5 hidden lg:flex`}>
                <NavLink to="/Home">Home</NavLink>
                <NavLink to="/Inventory">Inventory</NavLink>
                <NavLink to="/profile">Profile</NavLink>
                {userData?.user?.staff && (
                  <NavLink to="/admin/dashboard">Admin Dashboard</NavLink>
                )}
              </div>
            )}
            {/* Cart Button ---------------------------------------------------------------------- */}
            {isLoggedIn ? (
              <div className="lg:flex-none gap-2 lg:flex items-center">
                <label htmlFor="my-drawer" className="btn-glass drawer-button">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle"
                  >
                    <div className="indicator">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="badge badge-sm indicator-item">
                        {getTotalQuantity()}
                      </span>
                    </div>
                    <span className="text-sm font-semibold">Reserve</span>
                  </div>
                </label>
                <div className="drawer">
                  <input
                    id="my-drawer"
                    type="checkbox"
                    className="drawer-toggle"
                  />
                  <div className="drawer-content">
                    {/* Page content here */}
                  </div>
                  <div className="drawer-side">
                    <label
                      htmlFor="my-drawer"
                      aria-label="close sidebar"
                      className="drawer-overlay"
                    ></label>
                    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                      <CartPage />
                    </ul>
                  </div>
                </div>

                {/* User Info ---------------------------------------------------------------------- */}
                <div className="dropdown dropdown-end">
                  {/* User info  */}
                  <div className="flex flex-row gap-2 items-center">
                    {/* User Name and Position */}
                    <div className="ml-2">
                      <h1 className="text-xs font-semibold text-gray-800 hidden lg:block">
                        {userData?.user &&
                          `${userData.user.first_name} ${userData.user.last_name}`}
                      </h1>
                      {userData?.user?.staff?.position && (
                        <p className="text-[10px] text-gray-500 hidden lg:block">
                          {userData.user.staff.position}
                        </p>
                      )}
                    </div>
                    {/* User Avatar*/}
                    <label
                      tabIndex={0}
                      className="btn btn-ghost btn-circle avatar"
                    >
                      <div className="w-12 rounded-full">
                      <img
                              src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
                              alt="Avatar"
                            />
                      </div>
                    </label>
                  </div>
                  {/* Dropdown panel */}
                  <ul
                    tabIndex={0}
                    className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                  >
                    <li className="flex items-center">
                      <NavLink to="/profile" className="justify-between">
                        Profile
                      </NavLink>
                    </li>
                    {userData && userData.user && userData.user.staff && (
                      <li className="flex items-center ">
                        <NavLink
                          to="/admin/dashboard"
                          className="justify-between"
                        >
                          Admin Dashboard
                        </NavLink>
                      </li>
                    )}
                    <li className="flex items-center">
                      <LoginButton />
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="lg:flex-2">
                <LoginButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
