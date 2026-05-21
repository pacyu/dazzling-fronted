import axios from 'axios'
import router from '../router'

export const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN', 
  xsrfHeaderName: 'X-XSRF-TOKEN'
})

request.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname
      if (!currentPath.includes('/login')) {
        router.push('/login')
      }
    }
    return Promise.reject(error)
  }
)