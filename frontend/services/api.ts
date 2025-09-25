import axios from 'axios';
import { AuthStorageService } from './authStorageService';
import { router } from 'expo-router';

const api = axios.create({
  baseURL: process.env.API_URL || 'http://192.168.1.6:3333/api/',
});

api.interceptors.request.use(async (config) => {
  const userToken = await AuthStorageService.getToken();

  if (userToken?.access_token) {
    config.headers?.set('Authorization', `Bearer ${userToken.access_token}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // console.log(error.response)
    if (error.response?.status === 401) {
      await AuthStorageService.removeToken();

      router.replace('/login');
    }

    return Promise.reject(error);
  }
);

export default api;
