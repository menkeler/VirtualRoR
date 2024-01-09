import React from 'react';
import Navbar from '../../components/wholepage/Navbar';
import Footer from '../../components/wholepage/Footer';
function LoginPage() {
  return (
    <>
      
      <div className="flex flex-col max-h-screen">
      <Navbar />

      <div className="w-full vcarousel rounded-box overflow-hidden">
          <div className="carousel-item w-full">
            <img src="public/Loginbackground.jpg" className="w-auto object-cover" alt="Background" />
          </div>
        </div>
      <Footer />
    </div>
    </>
  );
}

export default LoginPage;