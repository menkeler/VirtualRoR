import React from 'react';
import Navbar from './../components/wholepage/Navbar';
import Footer from '../components/wholepage/Footer';
function Home() {

return (
    <>
        <Navbar />
        <h1>THIS IS HOME PAGE</h1>
        <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
            <div className="max-w-md">
            <h1 className="text-5xl font-bold">Posts Here If logged In Feed Like FB Home </h1>
            <a>----------------------------------------------------------------------------------</a>
            <br/>
            <h1 className="text-5xl font-bold">If Logged out Display Welcome To the Room of Requirements</h1>
            </div>
        </div>
        </div>
        <Footer />
    </>
);
}

export default Home;
