// services/authService.js
import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = "http://localhost:6330/api/";
const TOKEN_COOKIE_NAME = 'auth_token';

export const setAuthToken = (token) => {
  if (!token) return;
  Cookies.set(TOKEN_COOKIE_NAME, token, { expires: 7 });
};

export const setUserInfo = (userData) => {
  if (!userData) return;
  localStorage.setItem('user', JSON.stringify(userData));
};

export const getUserInfo = () => {
  const userInfo = localStorage.getItem('user');
  return userInfo ? JSON.parse(userInfo) : null;
};

export const removeUserInfo = () => localStorage.removeItem('user');
export const getAuthToken = () => Cookies.get(TOKEN_COOKIE_NAME);
export const removeAuthToken = () => Cookies.remove(TOKEN_COOKIE_NAME);

export const publicRequest = () => {
  const token = getAuthToken();

  const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}` })
    }
  });

  instance.interceptors.request.use(
    (config) => {
      const currentToken = getAuthToken();
      if (currentToken) {
        config.headers.Authorization = currentToken.startsWith('Bearer ') ? currentToken : `Bearer ${currentToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => {
      const token = response.headers['x-auth-token'] || response.data?.token || response.data?.accessToken;
      if (token) setAuthToken(token);
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        removeAuthToken();
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
