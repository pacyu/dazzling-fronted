import axios from 'axios'

export const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN', 
  xsrfHeaderName: 'X-XSRF-TOKEN'
})