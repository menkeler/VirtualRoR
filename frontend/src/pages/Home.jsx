import React, { useState, useEffect, useRef } from "react";
import Navbar from "./../components/wholepage/Navbar";
import Footer from "../components/wholepage/Footer";
import InquiryDonation from "./../components/Forms/InquiryDonation";
import { Link } from "react-router-dom";
import Postcard from "../components/Posts/Postcard";
import client from "../api/client";

function Home() {
  const [activeTab, setActiveTab] = useState("");
  const [posts, setPosts] = useState([]);
  const [postType, setPostType] = useState("");
  const [donorsTopTen, setDonorsTopTen] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedPostID, setSelectedPostID] = useState(null);
  const showInquiryDonation = false;
  const handlePostClick = (postID) => {
    setSelectedPostID(postID);
    document.getElementById("InquiryDonation").showModal();
  };
  //for anti duplication rendering on mounted post
  //cant think of another solution optimize for later
  const uniquePostIds = new Set();

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        // User has scrolled to the bottom
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchPosts(page, postType);
  }, [page, postType]);

  useEffect(() => {
    fetchToptenDonors();
  }, []);

  const fetchPosts = async (page, type) => {
    try {
      const response = await client.get(
        `posts/posts/?page=${page}&status=Accepted&category=${type}`
      );
      setPosts((prevPosts) => [...prevPosts, ...response.data.results]);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchToptenDonors = async () => {
    try {
      const response = await client.get(
        "transactions/transactions/total_donations_this_month/"
      );
      setDonorsTopTen(response.data.user_donation_data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleTabChange = (tabLabel) => {
    setActiveTab(tabLabel);
  };

  return (
    <>
      <div className="bg-gray-200">
        <Navbar />

        <div className="md:flex grid grid-col-2 min-h-screen mt-5">
          {/* Left Side */}
          <div className="bg-gray-100 flex-grow px-8 py-2 md:ml-[20vw] md:mr-12 rounded-lg">
            <h1 className="text-lg font-bold mb-4 mt-8">Recent Posts</h1>
            <div
              role="tablist"
              className="tabs tabs-bordered tabs-md lg:w-full lg:mx-auto bg-gray-300 sticky top-0 z-10 rounded-tl-lg rounded-tr-lg"
            >
              <input
                type="radio"
                name="my_tabs_1"
                role="tab"
                className="tab"
                aria-label="All"
                checked={activeTab === ""}
                onChange={() => {
                  handleTabChange("");
                  setPostType("");
                  setPosts([]);
                  setPage(1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />

              <input
                type="radio"
                name="my_tabs_1"
                role="tab"
                className="tab"
                aria-label="Regular"
                checked={activeTab === "Regular"}
                onChange={() => {
                  handleTabChange("Regular");
                  setPostType("Regular");
                  setPosts([]);
                  setPage(1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
              <input
                type="radio"
                name="my_tabs_1"
                role="tab"
                className="tab"
                aria-label="Announcements"
                checked={activeTab === "Announcements"}
                onChange={() => {
                  handleTabChange("Announcements");
                  setPostType("Announcements");
                  setPosts([]);
                  setPage(1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
            <div className="grid grid-cols-1 gap-1 tab-content p-1">
              {posts.map((post) => {
                //for anti duplication rendering on mounted post
                //cant think of another solution optimize for later
                // Check if the post ID is already in the set
                if (
                  !uniquePostIds.has(post.id) &&
                  (post.category === activeTab || activeTab === "")
                ) {
                  // Add the post ID to the set
                  uniquePostIds.add(post.id);

                  return (
                    <div key={post.id} className="mb-5">
                      <Postcard Data={post} onPostClick={handlePostClick} />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>{" "}
          {/* left side */}
          {/* Right Side */}
          <div className="w-1/4 sticky top-50 max-h-screen overflow-y-auto scrollbar-hidden lg:block sm:hidden">
            {/* Post Now */}
            <div className="card w-80 bg-base-100 shadow-xl my-5">
              <span className="text-xl font-bold text-left mb-2">
                Post now~
              </span>
              <div className="grid grid-cols-1 gap-1">
                <Link to="/NewPost" className="btn btn-cube p-2">
                  {" "}
                  <i className="fa-solid fa-pen"></i>{" "}
                  <span className="">Create Post </span>{" "}
                </Link>
                {/* <button className="btn btn-cube p-2"><i class="fa-solid fa-photo-film"></i><span className="">Image</span></button> */}
              </div>
            </div>

            {/* Tools */}
            <div className="card w-80 bg-base-100 shadow-xl my-5">
              <span className="text-xl font-bold text-left mb-2">Tools</span>
              <div className="grid grid-cols-2 gap-1">
                <button
                  className="btn btn-accent"
                  onClick={() => handlePostClick(null)}
                >
                  <i className="fa-solid fa-hand-holding-hand"></i>
                  Donate
                </button>

                <InquiryDonation postID={selectedPostID} />

                <Link to="/Inventory" className="btn btn-accent">
                  <i className="fa-solid fa-hand-holding-hand"></i>
                  Reserve
                </Link>
              </div>
            </div>

            {/* Top Donors */}
            <div className="card w-80 bg-base-100 shadow-xl my-5">
              <span className="text-xl font-bold text-center mb-2">
                Top 10 Donors of{" "}
                {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
              </span>
              <div className="grid grid-cols-1 gap-4">
                {/* Individual donor card */}
                {Array.from({ length: 10 }, (_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border-b"
                  >
                    {index <= 2 ? (
                      <div className="text-center">
                        <span
                          className={`fa fa-medal ${
                            index === 0
                              ? "text-3xl"
                              : index === 1
                              ? "text-2xl"
                              : "text-sm"
                          }`}
                        ></span>
                        <span className="block text-xl font-bold">
                          {index + 1}
                        </span>
                      </div>
                    ) : (
                      <span className="block text-xl font-bold">
                        {index + 1}
                      </span>
                    )}

                    <div>
                      <p className="text-lg font-semibold">
                        {donorsTopTen[index]?.first_name ?? "Empty"}{" "}
                        {donorsTopTen[index]?.last_name}
                      </p>
                      <p className="text-sm">
                        Items Donated:{" "}
                        {donorsTopTen[index]?.total_quantity_donated ?? "0"}
                      </p>
                    </div>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
                      alt={`Donor ${index + 1}`}
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>{" "}
          {/* rightisde */}
        </div>

        <Footer />
      </div>
    </>
  );
}

export default Home;
