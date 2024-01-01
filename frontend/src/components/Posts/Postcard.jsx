import React from 'react';

const Postcard = ({Data}) => {
  return (
    <div className="card card-side bg-white shadow-xl mx-8 rounded-lg overflow-hidden">
      {/* Display post content */}
      <div className="card-body p-6">
        <div className="flex items-center mb-4">
          {/* Profile picture */}
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="Profile Picture"
            className="w-12 h-12 rounded-full mr-4"
          />

          {/* User information */}
          <div>
            {/* User name */}
            <p className="text-lg font-semibold text-left">{Data.author.first_name} {Data.author.last_name}</p>
            {/* Date */}
           <p className="text-sm text-left text-gray-500">{new Date(Data.created_at).toLocaleString()}</p>
          </div>
        </div>

        {/* Post title */}
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">
        {Data.title}
        </h2>

        {/* Post content */}
        <div className="text-left mb-4">
          {/* Adding "text-left" class here */}
          {Data.message}
        </div>

        {/* Post image */}
        <div className="image-container w-full h-48 mb-4 overflow-hidden">
          <img
            src="https://placekitten.com/800/400"
            alt="Post Image"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Views icon */}
        <div className="flex items-center text-gray-500">
          <i className="fas fa-eye mr-2"></i>
          {Data.views}
        </div>
      </div>
    </div>
  );
};

export default Postcard;