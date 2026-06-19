import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import env from '@/config/env.ts'

const api: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  console.log(
    config.method,
    `${config.baseURL}${config.url}`,
    config?.params ?? config?.data,
  );
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
