import React, { useState } from "react";
import Navbar from "../../components/wholepage/Navbar";
import Footer from "../../components/wholepage/Footer";
import { useAuth } from "../../contexts/AuthContext";
import client from "../../api/client";
const NewRegularPostPage = () => {
  const { userData } = useAuth();
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Regular");
  const [status, setStatus] = useState("Pending");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

    
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const maxFileSize = 10 * 1024 * 1024; 

    if (file) {
      if (file.size <= maxFileSize) {
        const currentDate = new Date();
        const timestamp = currentDate.getTime(); 
        const fileName = `${timestamp}_${file.name}`; 
        const renamedFile = new File([file], fileName, { type: file.type }); 
        setImage(renamedFile); 
        setImagePreview(URL.createObjectURL(renamedFile)); 
      } else {
   
        alert("File size exceeds the limit (10 MB). Please select a smaller file.");
       
        e.target.value = "";
      }
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();

    if (message && title && category) {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("message", message);
      formData.append("status", status);
      formData.append("author", userData.user.user_id);
      formData.append("title", title);
      if (image) {
        formData.append("images", image);
      }

      try {
        console.log(formData);
        const response = await client.post("posts/posts/", formData);
        setMessage("");
        setTitle("");
        setCategory("Regular");
        setStatus("Pending");
        setImage(null);
        setImagePreview(null);

        document.getElementById("imageInput").value = "";

        console.log("Submission successful", message, title, category);
        console.log(response);
      } catch (error) {
        console.error("Error submitting post:", error);
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
              <h2 className="text-base font-bold mb-2 text-left">
                Description
              </h2>
              <textarea
                placeholder="Type here"
                className="resize-y border rounded-md p-2 w-full h-32"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="mb-5">
              <h2 className="text-base font-bold mb-2 text-left">
                Upload an Image
              </h2>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                name="image"
                id="imageInput"
                className="w-full"
              />

              {imagePreview && (
                <div className="mt-2 w-32 h-32 rounded-md overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Selected Image"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>

            <div className="mb-5">
              <h2 className="text-base font-bold mb-2 text-left">Type</h2>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input input-bordered w-full bg-white"
              >
                <option value="Regular">Regular</option>
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

export default NewRegularPostPage;
