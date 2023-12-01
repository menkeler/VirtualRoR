import axios from 'axios';
import Cookies from 'js-cookie';

// Get the authToken from Cookies
const authToken = Cookies.get('authToken');

const client = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  withCredentials: true,
  headers: {
    // Include Authorization header only if authToken is present
    ...(authToken && { 'Authorization': `Token ${authToken}` }),
  },
});

export default client;
