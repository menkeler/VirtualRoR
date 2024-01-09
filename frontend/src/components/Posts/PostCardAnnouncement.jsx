import React from 'react';

const PostCardAnnouncement = ({ Data }) => {
  return (
    <div className="card card-side bg-white shadow-xl mx-0 md:mx-0 rounded-lg  w-full">
      <div className="card-body p-4">
        {/* Author information */}
        <div className="flex items-center mb-2">
          {/* Profile picture */}
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="Profile Picture"
            className="w-8 h-8 rounded-full mr-2"
          />
          {/* Author details */}
          <div>
            
            <p className="text-sm font-semibold text-left">
              {Data.author.first_name} {Data.author.last_name}  
              {/* Staff position badge */}
            
            </p>
            <p className="text-xs text-left text-gray-500">
              {new Date(Data.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Announcement title */}
        <p className="text-2xl md:text-3xl font-bold text-left  text-blue-600 break-all ">
          {Data.title}
        </p>
        {/* <span className="badge badge-info ml-1">ANNOUCNEMENT</span> */}

        {/* Announcement message */}
        {Data.message && (
         <p className="text-left mb-4 break-all">
         {Data.message}
       </p>
        )}



        {/* Announcement image */}
        {Data.image && (
          <div className="image-container w-full h-32 mb-2 overflow-hidden">
            <img
              src={Data.image}
              alt="Announcement Image"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}

        {/* Views count */}
        <div className="flex items-center text-xs text-gray-500">
          <i className="fas fa-eye mr-1"></i>
          {Data.views}
        </div>
        
      </div>
      
    </div>
  );
};

export default PostCardAnnouncement;