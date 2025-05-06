import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api', // Passer par API Gateway
});

API.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = token;
    return config;
});

export default API;
