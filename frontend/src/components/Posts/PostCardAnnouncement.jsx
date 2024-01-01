import React from 'react';

const PostCardAnnouncement = ({ Data }) => {
  return (
    <div className="card card-side bg-white shadow-md mx-8 rounded-lg overflow-hidden">
      <div className="card-body p-4">
        <div className="flex items-center mb-2">
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="Profile Picture"
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <p className="text-sm font-semibold text-left">
              {Data.author.first_name} {Data.author.last_name}  
              <span className="badge badge-info ml-1"> {Data.author.staff.position}</span>
            </p>
            <p className="text-xs text-left text-gray-500">
              {new Date(Data.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-left text-blue-600 mb-2">{Data.title}</h2>

        {Data.message && (
          <div className="text-left text-sm mb-2">
            {Data.message}
          </div>
        )}

        {Data.image && (
          <div className="image-container w-full h-32 mb-2 overflow-hidden">
            <img
              src={Data.image}
              alt="Announcement Image"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex items-center text-xs text-gray-500">
          <i className="fas fa-eye mr-1"></i>
          {Data.views}
        </div>
      </div>
    </div>
  );
};

export default PostCardAnnouncement;
