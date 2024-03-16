import React from "react";
import InquiryDonation from "../Forms/InquiryDonation";

const Postcard = ({ Data, onPostClick ,display ,admin}) => {
  const handleClick = () => {
    onPostClick(Data.id);
  };
  return (
    <div className="card card-compact border border-gray-400 rounded-md z-10">
      {/* Display post content */}
      <div className="card-body p-4">
        <div className="flex  md:flex-row items-center mb-1">
          {/* Profile picture */}
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="Profile Picture"
            className="w-8 h-8 rounded-full mb-2 mr-2"
          />

          {/* User information */}
          <div>
            {/* User name */}
            <p className="text-sm font-semibold text-left">
              {Data.author.first_name} {Data.author.last_name}
            </p>
            {/* Date */}
            <p className="text-xs text-gray-500 text-left">
              {new Date(Data.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Post title */}
        <p className="text-2xl font-semibold text-left text-slate-800 break-all border-solid border-b border-slate-400 break-all">
          {Data.title}
        </p>
        {/* Post Message*/}
        <p className="text-left mb-1 mt-2 break-all">{Data.message}</p>

        {/* Post image */}
        <div className="image-container w-full max-h-100 mb-4 md:mb-6 overflow-hidden">
          <img
            src="https://placekitten.com/800/400"
            alt="Post Image"
            className="w-full object-cover rounded-lg"
          />
        </div>  
        
        {!display && !admin && Data.category === "Regular" && (
  <button className="btn btn-cube p-2" onClick={handleClick}>Donate This Post</button>
)}

        

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
