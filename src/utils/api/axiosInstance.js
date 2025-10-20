
import axios from 'axios';
import Cookies from "js-cookie";
import { MAIN_URL } from '../constants/Endpoints';

const getToken = () => {
  return Cookies.get("token") || null;
};

const axiosInstance = axios.create({
  baseURL: MAIN_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Accept-Language header-i localStorage-dən götür
    const lang = localStorage.getItem('i18nextLng') || localStorage.getItem('lang') || 'az';
    config.headers['Accept-Language'] = lang;
    
    // Debug üçün console.log
    console.log('Accept-Language header:', lang);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;