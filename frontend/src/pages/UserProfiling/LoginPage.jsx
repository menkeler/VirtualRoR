    import React from 'react';
    import Navbar from '../../components/wholepage/Navbar';
    function LoginPage() {
    
    return (
        <>
            <Navbar />
            <div className="w-100% vcarousel rounded-box">
                <div className="carousel-item w-full">
                <img src="public/Loginbackground.jpg" className='h-full'/>
                </div> 
            </div>
        </>
    );
    }

    export default LoginPage;
