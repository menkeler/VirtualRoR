import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import Cookies from 'js-cookie';

function LoginButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = Cookies.get('authToken');
    setIsLoggedIn(!!authToken);
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
          await submitLogin(userInfoData);
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
      console.log('Checking registration...');
      const res = await client.post('users/users/checkregister/', { email });

      if (res.data.detail === 'User not registered') {
        console.log('User not registered. Proceeding to registration...');
        await createAccount(userInfoData);
      } else {
        console.log('User already registered. Logging in...');
        await loginUser(userInfoData);
      }
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  }

  async function createAccount(userInfoData) {
    const { email, given_name, family_name } = userInfoData;

    try {
      console.log('Registering user...');
      const registerResponse = await client.post('users/users/register/', {
        email,
        first_name: given_name,
        last_name: family_name,
      });

      if (registerResponse.status === 201) {
        console.log('Registration successful. Logging in...');
        await loginUser(userInfoData);
      } else {
        console.error('Registration failed:', registerResponse.statusText);
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  }

  async function loginUser(userInfoData) {
    const { email } = userInfoData;

    try {
      console.log('Logging in user...');
      const loginResponse = await client.post('users/users/login/', { email });

      if (loginResponse.status === 200) {
        const authToken = loginResponse.data.token;

        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + 60 * 60 * 1000); // 1 hour in milliseconds

        // Store the token in a cookie
        Cookies.set('authToken', authToken, { expires: expirationDate, secure: true, sameSite: 'Strict' });

        setIsLoggedIn(true);

        // Redirect or navigate to the profile page
        navigate('/Profile');
        window.location.reload();
      } else {
        console.error('Login failed:', loginResponse.statusText);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  async function submitLogout(e) {
    console.log('Logging out...');
    e.preventDefault();

    try {
      const authToken = Cookies.get('authToken');
      await client.post(
        'users/users/logout/',
        {},
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
      navigate('/home');
      // Always remove the authentication token cookie
      Cookies.remove('authToken');
      navigate('/home');
      window.location.reload();
      console.log('Token Removed');
    } catch (error) {
      // Even if there's an error, remove the authentication token cookie
      Cookies.remove('authToken');
      console.error('Logout error:', error);
    } finally {
      // This will execute regardless of success or failure
      setIsLoggedIn(false);
    }
  }

  return (
    <div>
      {isLoggedIn ? (
        <>
          <button onClick={submitLogout}>Logout</button>
        </>
      ) : (
        <div className="flex items-center justify-center">
        <button
          onClick={Login}
          className="bg-accent hover:bg-primary text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
        >
          Login with Google
        </button>
      </div>
      )}
    </div>
  );
}

export default LoginButton;