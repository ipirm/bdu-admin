import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://amazon-24ttl-6a495dfd71bd.herokuapp.com/api/'
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
