import React from 'react';
import Navbar from '../../components/wholepage/Navbar';
import Footer from '../../components/wholepage/Footer';
function LoginPage() {
  return (
    <>
      
        <Navbar />
        <div className="w-full vcarousel rounded-box">
          <div className="carousel-item w-full">
            <img src="public/Loginbackground.jpg" className="w-auto object-cover" alt="Background" />
          </div>
        </div>
        <Footer/>
    </>
  );
}

export default LoginPage;