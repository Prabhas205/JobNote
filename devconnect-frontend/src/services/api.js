import axios from 'axios';

// Create a custom instance of axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Grab the token from storage (using the correct key for this app)
    const rawToken = localStorage.getItem('devconnect_token');
    
    let token = null;
    if (rawToken) {
      try {
        // Redux stores it stringified, so we parse it
        token = JSON.parse(rawToken);
      } catch (e) {
        token = rawToken;
      }
    }
    
    // If we have a token, attach it to every request automatically!
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
