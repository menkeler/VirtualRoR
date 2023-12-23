import React, { useState } from 'react';
import Navbar from './../components/wholepage/Navbar';
import Footer from '../components/wholepage/Footer';
import InquiryDonation from './../components/Forms/InquiryDonation';
import { Link } from 'react-router-dom';
function Home() {
  const [activeTab, setActiveTab] = useState('Posts');

  const handleTabChange = (tabLabel) => {
    setActiveTab(tabLabel);
  };

  return (
    <>
      <Navbar />
        <div className="flex bg-gray-200">
        {/* Left SIde */}
        <div className=" flex-grow p-4">
            <div role="tablist" className="tabs tabs-lifted tabs-lg ml-96">
              <input
                type="radio"
                name="my_tabs_1"
                role="tab"
                className="tab"
                aria-label="Posts"
                checked={activeTab === 'Posts'}
                onChange={() => handleTabChange('Posts')}
              />
              <div role="tabpanel" className="tab-content p-10">
              
      
                
              <div className="card card-side bg-base-100 shadow-xl my-5">
                {/* Display post content */}
                <div className="card-body">
                  {/* Post title */}
                  <h2 className="text-3xl font-bold text-center text-blue-600 card-title">
                    Random Post
                  </h2>

                  {/* Post image */}
                  <img src="https://placekitten.com/800/400" alt="Post Image" className="w-full h-40 object-cover mb-4" />

                  {/* Post content */}
                  <div className="card-actions justify-start">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </div>
                </div>
              </div>
              {/* end of card */}
                 
              <div className="card card-side bg-base-100 shadow-xl my-5">
                {/* Display post content */}
                <div className="card-body">
                  {/* Post title */}
                  <h2 className="text-3xl font-bold text-center text-blue-600 card-title">
                    Random Post
                  </h2>

                  {/* Post image */}
                  <img src="https://placekitten.com/800/400" alt="Post Image" className="w-full h-40 object-cover mb-4" />

                  {/* Post content */}
                  <div className="card-actions justify-start">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </div>
                </div>
              </div>
                 {/* end of card */}
                 <div className="card card-side bg-base-100 shadow-xl my-5">
                {/* Display post content */}
                <div className="card-body">
                  {/* Post title */}
                  <h2 className="text-3xl font-bold text-center text-blue-600 card-title">
                    Random Post
                  </h2>

                  {/* Post image */}
                  <img src="https://placekitten.com/800/400" alt="Post Image" className="w-full h-40 object-cover mb-4" />

                  {/* Post content */}
                  <div className="card-actions justify-start">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </div>
                </div>
              </div>
                 {/* end of card */}
                 
                
                {/* Mixed Posts Content Goes Here */}
              </div>

              <input
                type="radio"
                name="my_tabs_1"
                role="tab"
                className="tab"
                aria-label="Announcements"
                checked={activeTab === 'Announcements'}
                onChange={() => handleTabChange('Announcements')}
              />
              <div role="tabpanel" className="tab-content p-10">
                Announcements
                {/* Announcements Content Goes Here */}
              </div>

              <input
                type="radio"
                name="my_tabs_1"
                role="tab"
                className="tab"
                aria-label="Donation"
                checked={activeTab === 'Donation'}
                onChange={() => handleTabChange('Donation')}
              />
              <div role="tabpanel" className="tab-content p-10">
                Donation
                {/* Donation Content Goes Here */}
              </div>
            </div>
        </div>
      {/* Right Side */}
      <div className="flex-1/3 p-4 justify-center items-center mr-72">



        {/* Post Now */}
        <div className="card w-64 bg-base-100 shadow-xl my-5">
          <span className="text-xl font-bold text-left mb-2">Post now~</span>
          <div className="grid grid-cols-1 gap-1">
            <button className="btn btn-cube p-2">Create Post</button>
          </div>
        </div>

        {/* Tools */}
        <div className="card w-64 bg-base-100 shadow-xl my-5">
        <span className="text-xl font-bold text-left mb-2">Tools</span>
        <div className="grid grid-cols-3 gap-1">
          <InquiryDonation/>
          <Link to="/Inventory" className="btn btn-accent btn-cube p-2">
            Reserve Items
          </Link>
          <button className="btn btn-cube p-2">Test</button>
          <button className="btn btn-cube p-2">Test</button>
          <button className="btn btn-cube p-2">Test</button>
          <button className="btn btn-cube p-2">Test</button>
        </div>
      </div>
    
      {/* Top Donors */}
      <div className="card w-64 bg-base-100 shadow-xl my-5">
      <span className="text-xl font-bold text-left mb-2">Top Donors</span>
      <div className="grid grid-cols-1 gap-4">
        {/* Individual donor card */}
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="flex items-center justify-between p-4 border-b">
            <div>
              <p className="text-lg font-semibold">Donor {index}</p>
              <p className="text-sm">Occupation: Job Title</p>
            </div>
            {/* You can replace the image source with an actual profile image URL */}
            <img
              src={`https://randomuser.me/api/portraits/men/${index}.jpg`}
              alt={`Donor ${index}`}
              className="w-10 h-10 rounded-full"
            />
          </div>
        ))}
      </div>
    </div>

  </div>

        </div>
        <Footer />
    </>
  );
}

export default Home;