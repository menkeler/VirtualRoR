import React, { useState } from 'react';
import Navbar from '../../components/wholepage/Navbar';
import Footer from '../../components/wholepage/Footer';
import { useAuth } from '../../contexts/AuthContext';
import client from '../../api/client';
const NewRegularPostPage = () => {
  const { userData } = useAuth();
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Regular');
  const [status, setStatus] = useState('Pending')
  const handleSubmitPost = async (e) => {
    e.preventDefault();

    if (message && title && category) {
      //for admins
        if (category ===`Announcements`) {
          setStatus('Accepted');
        }

      try {
        console.log(userData.user.user_id);
        const response = await client.post('posts/posts/', {
          category:category,
          message: message,
          images: null,
          status: status,
          author: userData.user.user_id,
          title:title
        });
        setMessage('');
        setTitle('');
        setCategory('Regular');
        setStatus('Pending');

        console.log('Submission successful',message,title,category)
      } catch (error) {
        console.error('Error submitting post:', error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto my-10 bg-white shadow-md rounded-md overflow-hidden">
        <form onSubmit={handleSubmitPost}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2 text-left">Post</h2>
            <div className="border-t border-gray-200 my-8"></div>

            <div className="mb-5">
              <h2 className="text-base font-bold mb-2 text-left">Title</h2>
              <input
                type="text"
                placeholder="Please Enter Title (required)"
                className="input input-bordered w-full bg-white"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="mb-5">
              <h2 className="text-base font-bold mb-2 text-left">Description</h2>
              <textarea
                placeholder="Type here"
                className="resize-y border rounded-md p-2 w-full h-32"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="mb-5">
              <h2 className="text-base font-bold mb-2 text-left">Upload an Image</h2>
              <i className="fa-solid fa-image"> Now image Like This</i>
              <p className="text-gray-600">Image</p>
            </div>

            <div className="mb-5">
            <h2 className="text-base font-bold mb-2 text-left">Type</h2>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input input-bordered w-full bg-white"
            >
              <option value="Regular">Regular</option>
              <option value="News">News</option>
              {userData.user.staff && (
                <option value="Announcements">Announcements</option>
              )}
            </select>
          </div>
          </div>
          <button type="submit" className="btn btn-accent mb-32">
            Publish
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default NewRegularPostPage






