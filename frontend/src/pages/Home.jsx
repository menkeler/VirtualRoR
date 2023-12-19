import React, { useState } from 'react';
import Navbar from './../components/wholepage/Navbar';
import Footer from '../components/wholepage/Footer';

function Home() {
  const [activeTab, setActiveTab] = useState('Mixed Posts');

  const handleTabChange = (tabLabel) => {
    setActiveTab(tabLabel);
  };

  return (
    <>
      <Navbar />
      <div className="hero min-h-screen bg-gray-200">
        <div role="tablist" className="tabs tabs-lifted tabs-lg">
          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab"
            aria-label="Mixed Posts"
            checked={activeTab === 'Mixed Posts'}
            onChange={() => handleTabChange('Mixed Posts')}
          />
          <div role="tabpanel" className="tab-content p-10">
            Mixed Posts

            POste 1
            
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
      <Footer />
    </>
  );
}

export default Home;