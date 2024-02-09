import React from "react";

const Postcard = ({ Data }) => {
  return (
    <div className="card card-side bg-white shadow-xl mx-0 md:mx-0 rounded-lg  w-full">
      {/* Display post content */}
      <div className="card-body p-4 md:p-6">
        <div className="flex  md:flex-row items-center mb-4">
          {/* Profile picture */}
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="Profile Picture"
            className="w-12 h-12 rounded-full mb-4 md:mb-0 md:mr-4"
          />

          {/* User information */}
          <div className="text-center md:text-left">
            {/* User name */}
            <p className="text-lg font-semibold">
              {Data.author.first_name} {Data.author.last_name}
            </p>
            {/* Date */}
            <p className="text-sm text-gray-500">
              {new Date(Data.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Post title */}

        {/* Post title */}
        <p className="text-2xl md:text-3xl font-bold text-left  text-blue-600 break-all ">
          {Data.title}
        </p>

        <p className="text-left mb-4 break-all">{Data.message}</p>

        {/* Post image */}
        <div className="image-container w-full h-64 mb-4 md:mb-6 overflow-hidden">
          <img
            src="https://placekitten.com/800/400"
            alt="Post Image"
            className="w-64 h-64 object-cover rounded-lg"
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
