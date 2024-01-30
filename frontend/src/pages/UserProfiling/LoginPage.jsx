import React from "react";
import Navbar from "../../components/wholepage/Navbar";
import Footer from "../../components/wholepage/Footer";
function LoginPage() {
  return (
    <>
      <div className="flex flex-col h-screen">
        <Navbar />

        <div className="w-screen overflow-hidden items-center justify-center relative">
          <img
            src="public/Loginbackground.jpg"
            className="w-screen h-screen"
            alt="Background"
          />
          <div className="absolute w-screen h-screen bg-black top-0 left-0 z-10 opacity-40"></div>
          <h1 className="text-white font-semibold absolute text-6xl z-20 bottom-1/2 left-[10%]">
            Room of Requirement
          </h1>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
}

export default LoginPage;
