import React from "react";

const Postcard = ({ Data, onPostClick, display, admin }) => {
  const handleClick = () => {
    onPostClick(Data.id);
  };

  const category =
    Data.category === "Regular" ? Data.category : Data.category.slice(0, -1);

  const truncatedTitle =
    Data.title.length > 30 ? `${Data.title.slice(0, 30)}...` : Data.title;
  return (
    <div className="max-w-sm w-full md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto my-2">
      <div className="bg-white shadow rounded-md overflow-hidden border border-gray-300 flex flex-col justify-between">
        {/* Post header */}
        <div className="bg-gray-100 px-4 py-2 flex items-center justify-between">
          {/* User information */}
          <div className="flex items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
              alt="Profile Picture"
              className="w-10 h-10 rounded-full mr-2"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {Data.author.first_name} {Data.author.last_name}
              </p>
              <p className="text-xs text-gray-600">
                {new Date(Data.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          {/* Post title */}
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            <span className="text-blue-500 mr-1">{truncatedTitle}</span>
          </h2>
          {/* Post category */}
          <span className="text-xs font-semibold text-blue-600 py-1 px-2 rounded-full bg-blue-100">
            {category}
          </span>
        </div>

        {/* Post content */}
        <div className="px-4 py-2">
          {/* Post message */}
          <div className="bg-white p-3 mb-5 rounded-lg shadow">
            <p className="text-gray-800">{Data.message}</p>
          </div>

          {/* Post images */}
          {Data.images && Data.images.length > 0 && (
            <div className="flex justify-center mb-4">
              {Array.isArray(Data.images) ? (
                Data.images
                  .slice(0, 3)
                  .map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="max-w-96 h-auto max-h-96 object-cover rounded-md"
                    />
                  ))
              ) : (
                <img
                  src={Data.images}
                  alt="Post Image"
                  className="max-w-96 h-auto max-h-96 object-cover rounded-md"
                />
              )}
            </div>
          )}
          <div className="divider"></div>
          {/* Donate button */}
          {!display && !admin && Data.category === "Regular" && (
            <button
              className="bg-green-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
              onClick={handleClick}
            >
              Donate This Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Postcard;
