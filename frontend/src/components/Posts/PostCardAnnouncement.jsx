import React from 'react';

const PostCardAnnouncement = ({ Data }) => {
  return (
    <div className="card card-side bg-white shadow-md mx-4 md:mx-8 rounded-lg overflow-hidden">
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
              <span className="badge badge-info ml-1">{Data.author.staff.position}</span>
            </p>
            <p className="text-xs text-left text-gray-500">
              {new Date(Data.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Announcement title */}
        <h2 className="text-lg md:text-xl font-bold text-left text-blue-600 mb-2">{Data.title}</h2>

        {/* Announcement message */}
        {Data.message && (
          <div className="text-left text-sm mb-2">
            {Data.message}
          </div>
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