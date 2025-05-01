import axios from 'axios';

const productAxios = axios.create({
    baseURL: 'http://localhost:8080', // ✅ ProductService backend
    withCredentials: true,
});

productAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default productAxios;
