import axios from 'axios';
const token = localStorage.getItem('auth');
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
axios.interceptors.request.use((config) => {
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export default axios;
