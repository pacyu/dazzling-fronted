import { createRouter, createWebHistory } from 'vue-router'
import { request } from '../api/request'

import Home from '../pages/Home.vue'
import Articles from '../pages/Articles.vue'
import ArticleDetail from '../pages/ArticleDetail.vue'
import Category from '../pages/Category.vue'
import About from '../pages/About.vue'
import Search from '../pages/Search.vue'
import Laboratory from '../pages/Laboratory.vue'
import Login from '../pages/Login.vue'

import AdminLayout from '../pages/admin/Layout.vue'
import Dashboard from '../pages/admin/Dashboard.vue'
import ArticleManage from '../pages/admin/ArticleManage.vue'
import ArticleEdit from '../pages/admin/ArticleEdit.vue'
import CategoryManage from '../pages/admin/CategoryManage.vue'
import TagManage from '../pages/admin/TagManage.vue'
import CommentManage from '../pages/admin/CommentManage.vue'
import UserManage from '../pages/admin/UserManage.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/articles', name: 'Articles', component: Articles },
  { path: '/article', name: 'ArticleDetail', component: ArticleDetail },
  { path: '/category', name: 'Category', component: Category },
  { path: '/about', name: 'About', component: About },
  { path: '/search', name: 'Search', component: Search },
  { path: '/laboratory', name: 'Laboratory', component: Laboratory },
  { path: '/login', name: 'Login', component: Login },
  { path: '/manager', redirect: '/admin' },

  // 后台（嵌套路由）
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', component: Dashboard },
      { path: 'articles', component: ArticleManage },
      { path: 'article/edit', component: ArticleEdit },
      { path: 'categories', component: CategoryManage },
      { path: 'tags', component: TagManage },
      { path: 'comments', component: CommentManage },
      { path: 'users', component: UserManage }
    ]
  }
]

const router = createRouter({
  history: createWebHistory('/dazzling/'),
  routes
})

// 路由：检查是否登录
router.beforeEach(async (to, from) => {
  console.log(from.path)
  if (to.meta.requiresAuth) {
    try {
      const res = await request.get('/user/session')
      if (res.status === 200) {
        return true
      } else {
        return '/login'
      }
    } catch {
      return '/login'
    }
  } else {
    return true
  }
})

export default router