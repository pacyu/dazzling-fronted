import { request } from '../api/request'

// 响应拦截器处理 401
request.interceptors.response.use(
  res => res.data,
  err => {
    if (err.response?.status === 401) {
      // 未登录，跳转到登录页
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const getArticles = (page = 0, size = 10) => request.get('/article', { params: { page, size } })
export const getArticleBySlug = (slug: string) => request.get(`/article/${slug}`)
export const likeArticle = (slug: string) => request.post(`/liked/${slug}`)
export const viewArticle = (slug: string) => request.post(`/viewed/${slug}`)
export const postComment = (data: any) => request.post('/comment', data)
export const getTags = () => request.get('/tag')
export const getCategories = () => request.get('/category')
export const getArticlesByCategory = (cw: string, page = 0, size = 6) => request.get('/article/category', { params: { cw, page, size } })
export const searchArticles = (q: string, page = 0, size = 10) => request.get('/search', { params: { q, page, size } })
export const getAboutArticle = () => request.get('/article/about')
