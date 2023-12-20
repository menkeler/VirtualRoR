import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="570082942042-adm5mq21nhenrg4df0atk57m8c4h503c.apps.googleusercontent.com">
      <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>,
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
