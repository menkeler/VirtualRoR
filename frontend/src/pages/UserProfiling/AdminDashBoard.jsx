// AdminDashboard.js
import React, { useState } from 'react';
import Navbar from '../../components/wholepage/Navbar';
import DashboardTransactionPage from '../Dashboard/DashboardTransactionPage';
import DashboardInquiryPage from '../Dashboard/DashboardInquiryPage';
import AllUsersPage from '../UserProfiling/AllUsersPage';
import AdminDashBoardStats from '../Dashboard/AdminDashBoardStats';

const AdminDashboard = () => {
  // State to track the selected page
  const [selectedPage, setSelectedPage] = useState('dashboard');

  // Function to handle navigation item clicks
  const handlePageChange = (page) => {
    setSelectedPage(page);
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex h-screen bg-gray-100">
        {/* Side Navigation */}
        <div className="w-64 bg-gray-800">
          {/* Your side navigation content goes here */}
          <div className="p-4 text-white">
            <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
          </div>
          <ul className="p-2">
            {/* Dashboard */}
            <li className="mb-2 flex justify-center">
              <button
                onClick={() => handlePageChange('dashboard')}
                className={`text-gray-300  hover:bg-gray-700 px-4 py-2 w-full block ${
                  selectedPage === 'dashboard' ? 'bg-gray-700' : ''
                }`}
              >
                Dashboard
              </button>
            </li>
            {/* Users */}
            <li className="mb-2 flex justify-center ">
              <button
                onClick={() => handlePageChange('users')}
                className={`text-gray-300 hover:bg-gray-700 px-4 py-2 w-full block ${
                  selectedPage === 'users' ? 'bg-gray-700' : ''
                }`}
              >
                Users
              </button>
            </li>
             {/* INquiries */}
             <li className="mb-2 flex justify-center ">
              <button
                onClick={() => handlePageChange('inquiries')}
                className={`text-gray-300 hover:bg-gray-700 px-4 py-2 w-full block ${
                  selectedPage === 'inquiries' ? 'bg-gray-700' : ''
                }`}
              >
                Inquiries
              </button>
            </li>
            {/* Transactions */}
            <li className="mb-2 flex justify-center ">
              <button
                onClick={() => handlePageChange('transactions')}
                className={`text-gray-300 hover:bg-gray-700 px-4 py-2 w-full block ${
                  selectedPage === 'transactions' ? 'bg-gray-700' : ''
                }`}
              >
                Transactions
              </button>
            </li>
             {/* Posts */}
             <li className="mb-2 flex justify-center ">
              <button
                onClick={() => handlePageChange('posts')}
                className={`text-gray-300 hover:bg-gray-700 px-4 py-2 w-full block ${
                  selectedPage === 'posts' ? 'bg-gray-700' : ''
                }`}
              >
                Posts
              </button>
            </li>
            {/* Add more navigation items as needed */}
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Content Header */}
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Admin Dashboard - {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}
              </h1>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
            <div className="container mx-auto p-4">
              {/* Dashboard */}
              {selectedPage === 'dashboard' && (
                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Dashboard Content</h2>
                  <AdminDashBoardStats/>
                </section>
              )}
              {/* Users */}
              {selectedPage === 'users' && (
                <section className="mb-8">
                  <AllUsersPage/>
                </section>
              )}
               {/* Inquiries */}
               {selectedPage === 'inquiries' && (
                <section className="mb-8">

                  <DashboardInquiryPage/>
                </section>
              )}
               {/* Transaction */}
               {selectedPage === 'transactions' && (
                <section className="mb-8">
                  <DashboardTransactionPage/>  
                </section>
              )}
               {/* Posts */}
               {selectedPage === 'posts' && (
                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">PostsContent</h2>
                  {/* ... (your users content) */}
                </section>
              )}

              {/* Add more conditional rendering for other pages */}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;