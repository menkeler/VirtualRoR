import React, { useState } from 'react';
import Navbar from './../components/wholepage/Navbar';
import Footer from '../components/wholepage/Footer';
import InquiryDonation from './../components/Forms/InquiryDonation';
import { Link } from 'react-router-dom';
import Postcard from '../components/Posts/postcard';
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
            <div role="tablist" className="tabs tabs-boxed tabs-lg  ml-64 mx-auto bg-gray-200 py-4 rounded">
              <input
                type="radio"
                name="my_tabs_1"
                role="tab"
                className="tab ml-56 bg-base-100"
                aria-label="Posts"
                checked={activeTab === 'Posts'}
                onChange={() => handleTabChange('Posts')}
              />
              <div role="tabpanel" className=" tab-content">
              
      
                <Postcard/>
              
                 
           
                 
                
                {/* Mixed Posts Content Goes Here */}
              </div>

              <input
                type="radio"
                name="my_tabs_1"
                role="tab"
                className="tab bg-accent"
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
                className="tab bg-accent"
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
        <div className="card w-80 bg-base-100 shadow-xl my-5">
          <span className="text-xl font-bold text-left mb-2">Post now~</span>
          <div className="grid grid-cols-1 gap-1">
            <button className="btn btn-cube p-2">Create Post</button>
          </div>
        </div>

        {/* Tools */}
        <div className="card w-80 bg-base-100 shadow-xl my-5">
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
      <div className="card w-80 bg-base-100 shadow-xl my-5">
      <span className="text-xl font-bold text-left mb-2">Top Donors</span>
      <div className="grid grid-cols-1 gap-4">
        {/* Individual donor card */}
        {[1, 2, 3, 4, 5,6,7,8,9,10].map((index) => (
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