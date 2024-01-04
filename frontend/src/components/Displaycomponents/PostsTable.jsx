import React,{useState, useEffect } from 'react';
import Navbar from '../wholepage/Navbar';


const PostsTable = () => {
    const [typeQuery, setTypeQuery] = useState('');
    const [statusQuery, setStatusQuery] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    
  const handleStatusQuery = function (e, status) {
    e.preventDefault();
    setStatusQuery(status);
  };

  const handleTypeQuery = function (e) {
    e.preventDefault();
    setTypeQuery(e.target.value);
  };
  return (
    <>
     <div role="tablist" className="tabs tabs-bordered mt-5 mb-1 bg-gray-200">
        
        <input
        type="radio"
        name="my_tabs_1"
        role="tab"
        className="tab"
        aria-label="All"
        checked={statusQuery === ''}
        onChange={(e) => handleStatusQuery(e, '')}
      />
        <input
        type="radio"
        name="my_tabs_1"
        role="tab"
        className="tab"
        aria-label="Pending"
        checked={statusQuery === 'Pending'}
        onChange={(e) => handleStatusQuery(e, 'Pending')}
      />

      <input
        type="radio"
        name="my_tabs_1"
        role="tab"
        className="tab"
        aria-label="Accepted"
        checked={statusQuery === 'Accepted'}
        onChange={(e) => handleStatusQuery(e, 'Accepted')}
      />
  
    
      <select
        id="inquiryType"
        role="tab"
        className="tab ml-4"
        aria-label="Select"
        value={typeQuery}
        onChange={handleTypeQuery}
      >
        <option value="">All</option>
        <option value="Regular">Regular</option>
        <option value="News">News</option>
        <option value="Announcements">Announcements</option>
      </select>
      
      <input
              type="text"
              name="my_tabs_1"
              role="tab"
              value={searchQuery}
              aria-label="Search"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="tab text-left ml-4"
        />
     
    </div>
    
    
    
    
    
    
    </>
  )
}

export default PostsTable