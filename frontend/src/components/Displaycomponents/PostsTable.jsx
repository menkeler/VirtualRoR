import React,{useState, useEffect } from 'react';
import Navbar from '../wholepage/Navbar';

import client from '../../api/client';
const PostsTable = () => {
    const [typeQuery, setTypeQuery] = useState('');
    const [statusQuery, setStatusQuery] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState([])
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
      fetchPosts(currentPage,statusQuery,typeQuery);
    }, [currentPage,searchQuery,statusQuery,typeQuery]);

    const fetchPosts = async (page,status,type) => {
      try {
        const encodedSearchQuery = encodeURIComponent(searchQuery);
        const response = await client.get(`posts/posts/?page=${page}&status=${status}&category=${type}`);
        setPosts(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 30));
        console.log(response.data);
        
      } catch (error) {
        console.error('Error fetching posts:', error);
        setCurrentPage(1);
      }
    };
  
  const handleStatusQuery = function (e, status) {
    e.preventDefault();
    setStatusQuery(status);
  };

  const handleTypeQuery = function (e) {
    e.preventDefault();
    setTypeQuery(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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
    
    
    <div className=" overflow-x-auto">
      <table className="table min-w-full bg-white border border-gray-300">
        {/* Head */}
        <thead className="bg-green-500 text-white">
      <tr>
      <th className="py-3 px-4 border-b">Id</th>
      <th className="py-3 px-4 border-b">Title</th>
      <th className="py-3 px-4 border-b">Category</th>
      <th className="py-3 px-4 border-b">Message</th>
      <th className="py-3 px-4 border-b">Date Created</th>
      <th className="py-3 px-4 border-b text-center">Status</th>
      </tr>
    </thead>
    <tbody>
      {posts.map((post, index) => (
        <React.Fragment key={post.id}>
             <tr className="hover:bg-green-50" onClick={() => document.getElementById(`Detail${post.id}`).showModal()}>
            <td className="py-4 px-6 border-b ">{post.id}</td>
            <td className="py-4 px-6 border-b ">{post.title}</td>
            <td className="py-4 px-6 border-b ">{post.category}</td>
            <td className="py-4 px-6 border-b ">{post.message && post.message.length > 30 ? `${post.message.substring(0, 30)}...` : post.message}</td>
            <td className="py-4 px-6 border-b ">{post.created_at && new Date(post.created_at).toLocaleString()}</td>
            <td className={`py-4 px-6 border-b text-center ${post.status === 'Rejected' ? 'bg-red-300' : post.status === 'Pending' ? 'bg-gray-300' : 'bg-green-300'}`}>
              {post.status}
            </td>
          </tr>
        </React.Fragment>
      ))}
        </tbody>
      </table>
     {/* posts modal */}
  {posts.map((post, index) => (
  <dialog key={post.id} id={`Detail${post.id}`} className="modal">

    <div className="modal-box w-11/12 max-w-5xl bg-white p-6 rounded-lg shadow-md">
       <h3 className="font-bold text-2xl mb-4">Post {post.id}</h3>
    <p className="py-2 font-bold">
      <strong className="text-blue-500">Title:</strong> {post.title}
    </p>
    <p className="py-2">
      <strong className="text-blue-500">Category:</strong> {post.category}
    </p>
    <p className="py-2 font-bold">
      <strong className="text-blue-500">Author:</strong> {post.author.first_name} {post.author.last_name}
    </p>
    <p className="py-2">
      <strong className="text-blue-500">Status:</strong> {post.status}
    </p>

    {/* Display text area for message */}
    {post.message && (
        <div className="py-2">
          <strong className="text-blue-500">Message:</strong>
          <textarea
          value={post.message}
          readOnly
          disabled  // Add this line to make the textarea disabled
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          rows={4}
        />
      </div>
    )}

     {/* Display the first three images */}
     {post.images && post.images.length > 0 && (
      <div className="py-2">
        <strong className="text-blue-500">Images:</strong>
        <div className="flex">
          {post.images.slice(0, 3).map((image, index) => (
            <img key={index} src={image} alt={`Image ${index + 1}`} className="mr-2 max-w-1/3" />
          ))}
        </div>
      </div>
  )}

  <p className="py-2 font-bold">
    <strong className="text-blue-500">Created At:</strong> {new Date(post.created_at).toLocaleString()}
  </p>
  <div className="modal-action mt-8">
    <form method="dialog">
      <button className="btn bg-blue-500 text-white hover:bg-blue-600">Close</button>
    </form>
  </div>
</div>
      </dialog>
      ))}
    </div>
    
    
    <div className="join mt-4">
            <button className="join-item btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                «
              </button>
              <button className="join-item btn" onClick={() => handlePageChange(currentPage)}>
                Page {currentPage} of {totalPages}
              </button>
              <button className="join-item btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                »
            </button>
    </div>
    
    </>
  )
}

export default PostsTable