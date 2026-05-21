import { request } from '../api/request'

export interface CommentItem {
  id: number
  content: string
  username: string
  email?: string
  parentId: number | null
  rootId: number | null
  depth: number
  createdAt: string
  replies: CommentItem[]
  showReplyForm?: boolean
}

// 提交评论/回复的参数
export interface SubmitCommentParams {
  slug: string
  username: string
  email: string
  content: string
  parentId?: number | null
}

export const submitFeedback = (senderEmail: string, content: string) => request.post('/feedback', { senderEmail, content })
export const getArticles = (page = 0, size = 10) => request.get('/article', { params: { page, size } })
export const getArticleBySlug = (slug: string) => request.get('/article', { params: { v: slug } })
export const getRelatedArticles = (slug: string) => request.get('/article', { params: { v: slug } })
export const likeArticle = (slug: string) => request.post(`/liked`, { v: slug })
export const viewArticle = (slug: string) => request.post(`/viewed`, { v: slug })
export const getComments = (slug: string) => request.get('/comment', { params: { v: slug } })
export const submitComment = (data: any) => request.post('/comment', data)
export const getTags = () => request.get('/tag')
export const getCategories = () => request.get('/category')
export const getArticlesByCategory = (v: string, page = 0, size = 6) => request.get('/category', { params: { v, page, size } })
export const searchArticles = (q: string, page = 0, size = 10) => request.get('/search', { params: { q, page, size } })
export const getAboutArticle = () => request.get('/article', { params: { title: "about me" } })
