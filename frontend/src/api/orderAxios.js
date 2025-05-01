import axios from 'axios';

const orderAxios = axios.create({
    baseURL: 'http://localhost:8080', // ✅ OrderService backend
    withCredentials: true,            // ✅ CORS + credentials handling
});

orderAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default orderAxios;
