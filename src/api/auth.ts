import { request } from '../api/request'

export const login = (username: string, password: string) => {
  return request.post('/login', { username, password })
}