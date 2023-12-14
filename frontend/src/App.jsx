import './App.css';
import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/UserProfiling/LoginPage';
import UserProfilePage from './pages/UserProfiling/UserProfilePage';
import Home from './pages/Home';
import AdminDashBoard from './pages/UserProfiling/AdminDashBoard';
import InventoryPage from './pages/InventoryProfiling/InventoryPage';
import AllUsersPage from './pages/UserProfiling/AllUsersPage';
import TransactionPage from './pages/Transactions/TransactionPage';
function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <Routes>
        
        <Route path="login" element={<LoginPage />} />
        
        
        {isLoggedIn ? (
          // Paths under here are only accessible when logged in
          <>
            <Route path="home" element={<Home />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path = "/admin/dashboard" element = {<AdminDashBoard />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="Allusers" element={<AllUsersPage />} />
            <Route path="Transactions" element={<TransactionPage />} />
          </>
        ) : (
          // Redirect to login if not logged in
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
