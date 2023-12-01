import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import Cookies from 'js-cookie';

function LoginButton() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // For Logged in state
  useEffect(() => {
    const authToken = Cookies.get('authToken');
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const Login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        });

        if (userInfoResponse.ok) {
          const userInfoData = await userInfoResponse.json();
          submitLogin(userInfoData);
        } else {
          console.error('Error processing Google login:', userInfoResponse.status, userInfoResponse.statusText);
        }
      } catch (err) {
        console.error('Error processing Google login:', err);
      }
    },
  });

  async function submitLogin(userInfoData) {
    const { email } = userInfoData;
    try {
      const res = await client.post('users/check-registration', { email });
      loginUser(userInfoData);
    } catch (error) {
      createAccountAndLogin(userInfoData);
    }
  }

  async function createAccountAndLogin(userInfoData) {
    const { email, given_name, family_name } = userInfoData;

    try {
      const res = await client.post('users/register', { email, first_name: given_name, last_name: family_name });
      loginUser(userInfoData);
    } catch (error) {
      console.error('Registration error:', error);
    }
  }

  async function loginUser(userInfoData) {
    const { email } = userInfoData;

    try {
      const response = await client.post('users/login', { email });
  

      const authToken = response.data.token;
      console.log(authToken);

      const expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + 60 * 60 * 1000);  // 1 hour in milliseconds

      // Store the token in a cookie
      Cookies.set('authToken', authToken, { expires: expirationDate, secure: true, sameSite: 'Strict' });
  
  
      setIsLoggedIn(true);
  
      // Redirect or navigate to the profile page
      // navigate('/Profile');
    } catch (error) {
      console.error('Login error:', error);
    }
  }
  async function submitLogout(e) {
    e.preventDefault();
  
    try {
      const authToken = Cookies.get('authToken');
      const res = await client.post('users/logout', {}, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
  
      // Always remove the authentication token cookie
      Cookies.remove('authToken');
      console.log("Token Removed");
      setIsLoggedIn(false);
    } catch (error) {
      // Even if there's an error, remove the authentication token cookie
      Cookies.remove('authToken');
      setIsLoggedIn(false);
      console.error('Logout error:', error);
    }
  }
  
  

  return (
    <div>
      {isLoggedIn ? (
        <>
          <button onClick={submitLogout}>Logout</button>
          <br />
        </>
      ) : (
        <div className="btn btn-accent">
          <button onClick={Login}>Login with Google</button>
        </div>
      )}
    </div>
  );
}

export default LoginButton;
