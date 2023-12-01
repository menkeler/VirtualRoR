    import React from 'react';
    import Navbar from '../../components/wholepage/Navbar';
    function LoginPage() {
    
    return (
        <>
            <Navbar />
            <div className="w-100% vcarousel rounded-box">
                <div className="carousel-item w-full">
                <img src="public/Loginbackground.jpg"style={{ maxWidth: '100%', height: '100%' }}/>
                </div> 
            </div>
        </>
    );
    }

    export default LoginPage;
