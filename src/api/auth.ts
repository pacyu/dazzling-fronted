import { request } from '../api/request'

export const login = (username: string, password: string) => {
  return request.post('/login', { username, password })
}

export const getSession = () => {
  return request.get('/user/session')
}