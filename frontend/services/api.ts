import axios from 'axios';
import { AuthStorageService } from './authStorageService';
import { router } from 'expo-router';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL
});

api.interceptors.request.use(async (config) => {
  const userToken = await AuthStorageService.getToken();

  if (userToken?.access_token) {
    config.headers?.set('Authorization', `Bearer ${userToken.access_token}`);
  }
  console.log('request')
  return config;
});

api.interceptors.response.use(
  (response) => {
  console.log('response')
    
    return response},
  async (error) => {
  console.log('error')

      if (error.response?.status === 401) {
      await AuthStorageService.removeToken();

      router.replace('/(wellcome)/login');
    }

    return Promise.reject(error);
  }
);

export default api;
