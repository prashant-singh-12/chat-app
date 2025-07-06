// src/services/api.js
import axios from 'axios';
import { getToken, logout } from '../utils/auth';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Adjust based on your backend
});

// Add the Authorization header for every request if token exists
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            logout();
            window.location.href = '/login'; // Optional redirect to login
        }
        console.log(error);
        return Promise.reject(error);
    }
);

export default api;
