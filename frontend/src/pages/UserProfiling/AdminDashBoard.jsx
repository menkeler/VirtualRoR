// AdminDashboard.js
import React, { useEffect, useState } from "react";
import Navbar from "../../components/wholepage/Navbar";
import DashboardTransactionPage from "../Dashboard/DashboardTransactionPage";
import DashboardInquiryPage from "../Dashboard/DashboardInquiryPage";
import AllUsersPage from "../UserProfiling/AllUsersPage";
import AdminDashBoardStats from "../Dashboard/AdminDashBoardStats";
import Footer from "../../components/wholepage/Footer";
import InventoryProfilingTable from "../../components/Displaycomponents/InventoryProfilingTable";
import InventoryTable from "../../components/Displaycomponents/InventoryTable";
import PostsTable from "../../components/Displaycomponents/PostsTable";
import ExportDataPage from "./ExportDataPage";
import DashboardPostPage from "../Dashboard/DashboardPostPage";
import CreateItemProfile from "../../components/CustomButtons/Inventory/CreateItemProfile";
import Departments from "../../components/CustomButtons/Users/Departments";
import CalendarInquiry from "../Dashboard/CalendarInquiry";
const AdminDashboard = () => {
  // State to track the selected page
  const [selectedPage, setSelectedPage] = useState("dashboard");
  const [selectedUser, setSelectedUser] = useState(null);

  // Function to handle navigation item clicks
  const handlePageChange = (page) => {
    setSelectedPage(page);
    setSelectedUser(null);
  };

  const handleUserSelection = (selectedUserId) => {
    console.log("Selected user in parent component:", selectedUserId);
    setSelectedUser(selectedUserId);
  };

  const handleTypeSelection = (selectedType) => {
    console.log("Selected type in parent component:", selectedType);
    setSelectedPage(selectedType);
  };
  const showUser = (user) => {
    console.log(user)
    setSelectedPage("users");
    setSelectedUser(null)
  };


  // const showUser = (user) => {
  //   console.log(user)
  //   setSelectedPage("users");
  //   setSelectedUser(null)
    
  // };

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
                onClick={() => handlePageChange("dashboard")}
                className={`text-gray-300  hover:bg-gray-700 px-4 py-2 w-full block ${
                  selectedPage === "dashboard" ? "bg-gray-700" : ""
                }`}
              >
                <i className="fa-solid fa-chart-line"></i>
                <span className="text-xl"> Stats</span>
              </button>
            </li>

             {/* Calendar */}
             <li className="mb-2 flex justify-center ">
              <button
                onClick={() => handlePageChange("calendar")}
                className={`text-gray-300 hover:bg-gray-700 px-4 py-2 w-full block ${
                  selectedPage === "users" ? "bg-gray-700" : ""
                }`}
              >
                <i className="fa-solid fa-calendar"></i>
                <span className="text-xl"> Calendar</span>
              </button>
            </li>
            {/* Users */}
            <li className="mb-2 flex justify-center ">
              <button
                onClick={() => handlePageChange("users")}
                className={`text-gray-300 hover:bg-gray-700 px-4 py-2 w-full block ${
                  selectedPage === "users" ? "bg-gray-700" : ""
                }`}
              >
                <i className="fa-solid fa-users"></i>
                <span className="text-xl"> Users</span>
              </button>
            </li>
            {/* Inventory */}
            <li className="mb-2 flex justify-center">
              <button
                onClick={() => handlePageChange("inventory")}
                className={`text-gray-300  hover:bg-gray-700 px-4 py-2 w-full block ${
                  selectedPage === "inventory" ? "bg-gray-700" : ""
                }`}
              >
                <i className="fa-solid fa-warehouse"></i>
                <span className="text-xl"> Inventory</span>
              </button>
            </li>
            {/* ItemPRofile */}
            <li className="mb-2 flex justify-center">
              <button
                onClick={() => handlePageChange("itemprofile")}
                className={`text-gray-300  hover:bg-gray-700 px-4 py-2 w-full block ${
                  selectedPage === "itemprofile" ? "bg-gray-700" : ""
                }`}
              >
                <i className="fa-solid fa-basket-shopping"></i>
                <span className="text-xl"> ItemProfiles</span>
              </button>
            </li>
            {/* INquiries */}
            <li className="mb-2 flex justify-center ">
              <button
                onClick={() => handlePageChange("inquiries")}
                className={`text-gray-300 hover:bg-gray-700 px-4 py-2 w-full block ${
                  selectedPage === "inquiries" ? "bg-gray-700" : ""
                }`}
              >
                <i className="fa-solid fa-scroll"></i>
                <span className="text-xl"> Inquiries</span>
              </button>
            </li>
            {/* Transactions */}
            <li className="mb-2 flex justify-center ">
              <button
                onClick={() => handlePageChange("transactions")}
                className={`text-gray-300 hover:bg-gray-700 px-4 py-2 w-full block ${
                  selectedPage === "transactions" ? "bg-gray-700" : ""
                }`}
              >
                <i className="fa-solid fa-arrow-right-arrow-left"></i>
                <span className="text-xl"> Transactions</span>
              </button>
            </li>
            {/* Posts */}
            <li className="mb-2 flex justify-center ">
              <button
                onClick={() => handlePageChange("posts")}
                className={`text-gray-300 hover:bg-gray-700 px-4 py-2 w-full block ${
                  selectedPage === "posts" ? "bg-gray-700" : ""
                }`}
              >
                <i className="fa-solid fa-newspaper"></i>
                <span className="text-xl"> Posts</span>
              </button>
            </li>
        {/* Export */}
      <li className="mb-2 flex justify-center ">
              <button
                onClick={() => handlePageChange("exports")}
                className={`text-gray-300 hover:bg-gray-700 px-4 py-2 w-full block ${
                  selectedPage === "exports" ? "bg-gray-700" : ""
                }`}
              >
                <i className="fa-solid fa-file-export"></i>
                <span className="text-xl"> Export</span>
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
                Admin Dashboard -{" "}
                {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}{" "}
                {selectedUser &&
                  selectedUser.first_name &&
                  selectedUser.last_name &&
                  `- ${selectedUser.first_name} ${selectedUser.last_name}`}
              </h1>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
            <div className="container mx-auto p-4">
              {/* Dashboard */}
              {selectedPage === "dashboard" && (
                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">
                    Dashboard Content
                  </h2>
                  <AdminDashBoardStats />
                </section>
              )}
               {/* Calendar */}
               {selectedPage === "calendar" && (
                <section className="mb-8">
                <CalendarInquiry/>
                </section>
              )}
              
              {/* Users */}
              {selectedPage === "users" && (
                <section className="mb-8">
                  <Departments/>
                  <AllUsersPage
                    User={handleUserSelection}
                    Type={handleTypeSelection}
                  />
                </section>
              )}
              {/* inventory */}
              {selectedPage === "inventory" && (
                <div className="container mx-auto my-8 p-6 bg-white shadow-md rounded-md md:w-[84vw] lg:w-[64vw]">
                  <div>
                    
                    <InventoryTable type={2} />
                  </div>
                </div>
              )}
              {/* itemprofile */}
              {selectedPage === "itemprofile" && (
                <section className="mb-8">
                  <InventoryProfilingTable Admin={true} />
                </section>
              )}

              {/* Inquiries */}
              {selectedPage === "inquiries" && (
                <section className="mb-8">
                  <DashboardInquiryPage
                    User={selectedUser ? selectedUser.user_id : null}
                    Admin={true}
                    userBack={showUser}
                  />
                </section>
              )}
              {/* Transaction */}
              {selectedPage === "transactions" && (
                <section className="mb-8">
                  <DashboardTransactionPage
                    User={selectedUser ? selectedUser.user_id : null}
                    userBack={showUser}
                  />
                </section>
              )}
              {/* Posts */}
              {selectedPage === "posts" && (
                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">PostsContent</h2>
                  <DashboardPostPage 
                  User={selectedUser ? selectedUser.user_id : null}
                  userBack={showUser}
                  />
                </section>
              )}

              {selectedPage === "exports" && (
                <section className="mb-8">
                 <ExportDataPage/>
                </section>
              )}
              {/* Add more conditional rendering for other pages */}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AdminDashboard;
