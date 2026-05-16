<template>
  <div id="app">
    <template v-if="!isAdminRoute">
      <header>
        <div class="container-fluid position-relative no-side-padding">
          <a href="/" class="logo"><img src="/images/home.png" alt="Logo Image"></a>
          <div class="menu-nav-icon" data-nav-menu="#main-menu" @click="toggleMobileMenu">
            <i class="ion-navicon"></i>
          </div>
          <ul class="main-menu visible-on-click" :class="{ visible: mobileMenuOpen }" id="main-menu">
            <li><router-link to="/" @click="closeMobileMenu">主页</router-link></li>
            <li><router-link to="/articles" @click="closeMobileMenu">文章</router-link></li>
            <li><router-link to="/category" @click="closeMobileMenu">分类</router-link></li>
            <li><router-link to="/laboratory" @click="closeMobileMenu">实验室</router-link></li>
            <li><router-link to="/about" @click="closeMobileMenu">关于站点</router-link></li>
            <li><router-link to="/manager" @click="closeMobileMenu">后台</router-link></li>
          </ul>
          <div class="src-area">
            <form action="/search" method="GET">
              <button class="src-btn" type="submit"><i class="ion-ios-search-strong"></i></button>
              <input class="src-input" type="text" name="q" placeholder="Type of search">
            </form>
          </div>
          <div class="theme-switch-wrapper">
            <button id="theme-toggle-front" class="theme-toggle-btn" @click="toggleTheme">
              <i :class="isDark ? 'ion-ios-sunny' : 'ion-ios-moon'"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- 占位 slider (有些页面可能使用，但你可以做成 slot 或者条件显示) -->
      <div class="slider" v-if="showSlider"></div>

      <!-- 路由渲染区域 -->
      <router-view />

      <!-- 底部 (完全复用原 layout.html 的 footer) -->
      <footer>
        <div class="container">
          <div class="row">
            <div class="col-lg-4 col-md-6">
              <div class="footer-section">
                <a class="logo" href="/"><img src="/images/logo.jpg" alt="Logo Image"></a>
                <p class="copyright">Dazzling &copy; {{ currentYear }}. All rights reserved.</p>
                <ul class="icons">
                  <li><a href="https://www.youtube.com/channel/UCv0ZUlQUTY6moeIaGST0NFQ"><i class="ion-social-youtube-outline"></i></a></li>
                  <li><a href="https://x.com/dazzlism"><i class="ion-social-twitter-outline"></i></a></li>
                  <li><a href="https://www.instagram.com/shinnjitsu/"><i class="ion-social-instagram-outline"></i></a></li>
                  <li><a href="https://www.pinterest.com/Daisy/"><i class="ion-social-pinterest-outline"></i></a></li>
                  <li><a href="https://www.github.com/pacyu"><i class="ion-social-github-outline"></i></a></li>
                </ul>
              </div>
            </div>
            <div class="col-lg-4 col-md-6">
              <div class="footer-section">
                <h4 class="title"><b>Categories</b></h4>
                <!-- 分类数据需要从 store 或 API 获取 -->
                <ul v-for="(categoryGroup, groupIndex) in categoryGroups" :key="`group-${groupIndex}`">
                  <li v-for="cat in categoryGroup" :key="cat.kind">
                    <router-link :to="`/category?cw=${cat.kind}`">{{ cat.kind }}</router-link>
                  </li>
                </ul>
                <br>
                <h4 class="title"><b>我的联系方式</b></h4>
                <div class="contact-info">
                  <p><i class="ion-email"></i> 906835882@qq.com</p>
                  <p><i class="ion-email"></i> darkxzw@gmail.com</p>
                  <p><i class="ion-email"></i> darkchii@outlook.com</p>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6">
              <div class="footer-section">
                <h4 class="title"><b>反馈</b></h4>
                <div class="input-area">
                  <input class="email-input" id="email-input" type="text" placeholder="Enter your email">
                  <button class="submit-btn" type="submit" @click="bugFeedbackClick"><i class="icon ion-ios-email-outline"></i></button>
                </div>
                <textarea class="text-area-messge form-control" id="feedback-textarea" rows="4" placeholder="欢迎您对本站点提出您宝贵的意见！"></textarea>
              </div>
            </div>
          </div>
          <a href="#" class="go-top-btn" title="回到顶端">∧</a>
        </div>
      </footer>
    </template>

    <template v-else>
      <!-- 后台路由：直接渲染路由匹配的组件（AdminLayout） -->
      <router-view />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed  } from 'vue'
import { useRoute } from 'vue-router'
import { request } from './api/request'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin') || route.path.startsWith('/manager'))
// 根据路由名称判断是否显示 slider（例如首页、分类页等需要，文章详情不需要）
const showSlider = computed(() => {
  const hideSliderRoutes = ['Laboratory', 'About'] // 不需要 slider 的路由 name
  return !hideSliderRoutes.includes(route.name as string)
})
const mobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
// 深色模式
const isDark = ref(localStorage.getItem('frontTheme') === 'dark')
const toggleTheme = () => {
  isDark.value = !isDark.value
  const newTheme = isDark.value ? 'dark' : 'light'
  localStorage.setItem('frontTheme', newTheme)
  document.body.classList.toggle('dark-mode', isDark.value)
}
// 监听初始状态
onMounted(() => {
  if (isDark.value) document.body.classList.add('dark-mode')
  else document.body.classList.remove('dark-mode')
})

// 当前年份
const currentYear = new Date().getFullYear()

interface Category {
  kind: string;
  bgImage?: string;
}
const categoryGroups = ref<Category[][]>([])
const loadCategories = async () => {
  try {
    const res = await request.get('/category')
    // 按照原有逻辑分成每组3个
    const groups = []
    for (let i = 0; i < res.data.length; i += 3) {
      groups.push(res.data.slice(i, i + 3))
    }
    categoryGroups.value = groups
  } catch (error) {
    console.error('加载分类失败', error)
  }
}
loadCategories()

// 反馈邮件
const bugFeedbackClick = async () => {
  const emailInput = document.getElementById('email-input') as HTMLInputElement
  const contentTextarea = document.getElementById('feedback-textarea') as HTMLTextAreaElement
  const senderEmail = emailInput?.value || ''
  const content = contentTextarea?.value || ''
  if (!senderEmail || !content) {
    alert('必须正确填写邮箱和内容~')
    return
  }
  const token = document.querySelector('meta[name="_csrf"]')?.getAttribute('content')
  const header = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content')
  try {
    await request.post('/feedback', { senderEmail, content }, {
      headers: { [header!]: token }
    })
    alert('发送成功')
    emailInput.value = ''
    contentTextarea.value = ''
  } catch (err) {
    alert('邮件发送失败！')
  }
}
</script>

<style>
@import '/blog/styles/layout/styles.css';
@import '/blog/styles/layout/responsive.css';
@import '/blog/styles/theme.css'
</style>