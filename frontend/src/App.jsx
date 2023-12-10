import './App.css'
import React,{ useState,useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes ,Navigate} from 'react-router-dom';
import LoginPage from './pages/UserProfiling/LoginPage';
import UserProfilePage from './pages/UserProfiling/UserProfilePage';
import Home from './pages/Home';
import UsersList from './pages/UserProfiling/UsersListPage';
import useAuth from './hooks/useAuth';
import InventoryPage from './pages/InventoryProfiling/InventoryPage';

function App() {

  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="home" element={<Home/>} />
        <Route path="login" element={<LoginPage />} />

        <Route path="Inventory" element={<InventoryPage />} />
        paths under here are only acces when logged in
        <Route path="profile" element={<UserProfilePage />} />
        
       userslist path is only accessible if logged in and userData.user.staff is true
        <Route path="alluserslist" element={<UsersList />} />

        {/* Default route */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;

  