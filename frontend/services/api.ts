import axios from 'axios'
import { StorageService } from './storageService'
import { router } from 'expo-router'

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL + '/api'
})

api.interceptors.request.use(async (config) => {
  const userToken = await StorageService.getToken()

  if (userToken?.access_token) {
    config.headers?.set('Authorization', `Bearer ${userToken.access_token}`)
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await StorageService.removeToken()

      router.replace('/(wellcome)/login')
    }

    return Promise.reject(error)
  }
)

export default api
