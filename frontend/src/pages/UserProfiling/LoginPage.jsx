import React from 'react';
import Navbar from '../../components/wholepage/Navbar';

function LoginPage() {
  return (
    <>
      <div className="overflow-hidden">
        <Navbar />
        <div className="w-full vcarousel rounded-box">
          <div className="carousel-item w-full">
            <img src="public/Loginbackground.jpg" className="w-auto object-cover" alt="Background" />
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;