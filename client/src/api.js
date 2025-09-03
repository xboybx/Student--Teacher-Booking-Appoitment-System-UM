import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    withCredentials: true, // if you need cookies/auth
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
