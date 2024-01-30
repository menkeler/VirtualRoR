import React from "react";
import Navbar from "../../components/wholepage/Navbar";
import Footer from "../../components/wholepage/Footer";
function LoginPage() {
  return (
    <>
      <div className="flex flex-col h-screen">
        <Navbar />

        <div className="w-screen overflow-hidden items-center justify-center">
          <img
            src="public/Loginbackground.jpg"
            className="w-screen h-screen"
            alt="Background"
          />
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
}

export default LoginPage;
