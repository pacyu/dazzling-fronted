<template>
  <el-container class="admin-layout">
    <!-- 左侧侧边栏（白色背景） -->
    <el-aside width="220px" class="admin-sidebar">
      <div class="sidebar-header">
        <router-link to="/admin/dashboard">
          <img src="/images/home.png" alt="Logo" style="height: 32px;">
        </router-link>
      </div>
      <!-- 额外按钮组：返回主页 + 主题切换 -->
      <!-- <div class="sidebar-actions">
        <el-button type="primary" plain size="small" @click="newArticle" style="width: 100%; margin-bottom: 12px;">
          <el-icon><Edit /></el-icon> 写新文章
        </el-button>

        <div class="stat-item">文章：{{ stats.articles }} 篇</div>
        <div class="stat-item">评论：{{ stats.comments }} 条</div>
        <div class="stat-item">访问：{{ stats.views }} 次</div>
      </div> -->
      <!-- 导航菜单 -->
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#ffffff"
        text-color="#333333"
        active-text-color="#498BF9"
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><Odometer /></el-icon><span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/admin/articles">
          <el-icon><Document /></el-icon><span>文章管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/categories">
          <el-icon><Folder /></el-icon><span>分类管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/tags">
          <el-icon><PriceTag /></el-icon><span>标签管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/comments">
          <el-icon><ChatDotRound /></el-icon><span>评论管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/users">
          <el-icon><User /></el-icon><span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧主内容区 -->
    <el-container>
      <el-header class="admin-header">
        <div class="header-actions">
          <span class="action-item" @click="toggleTheme">
            <el-icon><Moon v-if="!isDarkMode" /><Sunny v-else /></el-icon>
            {{ isDarkMode ? '浅色' : '深色' }}
          </span>

          <span class="action-item" @click="goHome">
            <el-icon><HomeFilled /></el-icon> 返回主页
          </span>
          
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              管理员 <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import {
  HomeFilled,
  Moon,
  Sunny,
  Odometer,
  Document,
  Folder,
  PriceTag,
  ChatDotRound,
  User,
  ArrowDown
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const activeMenu = computed(() => route.path)

// 主题切换（与前台共享，使用 body.dark-mode 类）
const isDarkMode = ref(localStorage.getItem('frontTheme') === 'dark')

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  const newTheme = isDarkMode.value ? 'dark' : 'light'
  localStorage.setItem('frontTheme', newTheme)
  document.body.classList.toggle('dark-mode', isDarkMode.value)
}

const goHome = () => {
  router.push('/')
}

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true })
      ElMessage.success('已退出登录')
      router.push('/login')
    } catch {
      ElMessage.error('退出失败')
    }
  }
}

// 初始化主题状态
onMounted(() => {
  if (isDarkMode.value) {
    document.body.classList.add('dark-mode')
  } else {
    document.body.classList.remove('dark-mode')
  }
})
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}

.admin-sidebar {
  background-color: #ffffff;
  border-right: 1px solid #eaeef2;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.sidebar-header {
  height: 60px;
  line-height: 60px;
  text-align: center;
  border-bottom: 1px solid #eaeef2;
  flex-shrink: 0;
}

.sidebar-actions {
  padding: 16px;
  border-bottom: 1px solid #eaeef2;
  flex-shrink: 0;
}

.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  border-right: none;
}

.admin-header {
  height: 60px;
  background: #ffffff;
  border-bottom: 1px solid #eaeef2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 24px;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 46px;
}
.user-info {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.admin-main {
  background: #f5f7fa;
  padding: 20px;
  overflow-y: auto;
}
</style>