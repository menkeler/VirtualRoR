import './App.css'
import React,{ useState,useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes ,Navigate} from 'react-router-dom';
import LoginPage from './pages/UserProfiling/LoginPage';
import UserProfilePage from './pages/UserProfiling/UserProfilePage';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="home" element={<Home/>} />
        <Route path="login" element={<LoginPage />} />
        <Route path="profile" element={<UserProfilePage />} />
        {/* Default route */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;

  