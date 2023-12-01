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
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>

            </div>
        </div>
        </div>
        <Footer />
    </>
);
}

export default Home;
