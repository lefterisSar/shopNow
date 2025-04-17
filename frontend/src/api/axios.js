import axios from 'axios';

// In a real application, you would use environment variables
// For React apps created with Create React App, use REACT_APP_ prefix
// e.g., process.env.REACT_APP_API_URL

// For this example, we'll check if the hostname is localhost to determine environment
const isProduction = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1';

// Use HTTPS for production, HTTP for development
const protocol = isProduction ? 'https' : 'http';

// Use domain name in production, localhost in development
const host = isProduction ? 'api.shopnow.com' : 'localhost';

// Use standard HTTPS port (443) in production, specific ports in development
const port = isProduction ? '' : ':8081';

const instance = axios.create({
    baseURL: `${protocol}://${host}${port}`, // Environment-aware base URL
});

// Add authorization token to requests
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;
