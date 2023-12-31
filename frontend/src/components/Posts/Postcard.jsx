import React from 'react'

const Postcard = () => {
  return (
    <div className="card card-side bg-base-100 shadow-xl mx-8">
                {/* Display post content */}
                <div className="card-body">

                <div className="flex items-center">
                    {/* Profile picture */}
                    <img
                      src="https://randomuser.me/api/portraits/men/1.jpg"  // Replace with actual profile picture URL
                      alt="Profile Picture"
                      className="w-10 h-10 rounded-full mr-5"
                    />

                    {/* User information */}
                    <div>
                      {/* User name */}
                      <p className="text-xl font-semibold text-left">John Doe</p>
                      {/* Date */}
                      <p className="text-sm text-left">December 29, 2023 22:10</p>
                    </div>
                  </div>

                  {/* Post title */}
                  <h2 className="text-2xl font-bold text-center text-blue-600 card-title">
                    Random Post
                  </h2>
                  <div className="card-actions justify-start text-left">
                    {/* Adding "text-left" class here */}
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </div>
                  {/* Post image */}
                  <div className="image-container w-96 h-40 mb-4 overflow-hidden">
                    <img
                      src="https://placekitten.com/800/400"
                      alt="Post Image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                   {/* Views icon */}
                  <div className="flex items-center justify-start">
                  <span className="text-gray-500">Icon</span>
                  <FontAwesomeIcon icon="fa-solid fa-eye" />
                  <span className="text-gray-500">: 500 views</span>
                  </div>
                  {/* Post content */}
                </div>
              </div>
  )
}

export default Postcard