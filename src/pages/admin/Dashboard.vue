<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-content">
            <div class="card-icon"><el-icon><document /></el-icon></div>
            <div class="card-info">
              <div class="card-num">{{ stats.articles }}</div>
              <div class="card-text">文章总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-content">
            <div class="card-icon"><el-icon><chat-dot-round /></el-icon></div>
            <div class="card-info">
              <div class="card-num">{{ stats.comments }}</div>
              <div class="card-text">评论总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-content">
            <div class="card-icon"><el-icon><folder /></el-icon></div>
            <div class="card-info">
              <div class="card-num">{{ stats.categories }}</div>
              <div class="card-text">分类数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="card-content">
            <div class="card-icon"><el-icon><price-tag /></el-icon></div>
            <div class="card-info">
              <div class="card-num">{{ stats.tags }}</div>
              <div class="card-text">标签数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span>最近文章</span></template>
          <el-table :data="recentArticles" style="width: 100%">
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="author" label="作者" width="120" />
            <el-table-column prop="releasedAt" label="发布日期" width="180" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><span>最新评论</span></template>
          <el-table :data="recentComments" style="width: 100%">
            <el-table-column prop="content" label="内容" show-overflow-tooltip />
            <el-table-column prop="createdAt" label="发布时间" width="180" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { request } from '../../api/request'

const stats = ref({ articles: 0, comments: 0, categories: 0, tags: 0 })
const recentArticles = ref([])
const recentComments = ref([])

const fetchStats = async () => {
  const [articles, categories, tags, comments] = await Promise.all([
    request.get('/article?page=0&size=1'),
    request.get('/category'),
    request.get('/tag'),
    request.get('/comment')
  ])
  stats.value.articles = articles.data.totalElements
  stats.value.categories = categories.data.length
  stats.value.tags = tags.data.length
  stats.value.comments = comments.data.totalElements
}

const fetchRecent = async () => {
  const articlesRes = await request.get('/article?page=0&size=5&sort=releasedAt,desc')
  recentArticles.value = articlesRes.data.content
  const commentsRes = await request.get('/comment?page=0&size=5&sort=createdAt,desc')
  recentComments.value = commentsRes.data.content
}

onMounted(() => {
  fetchStats()
  fetchRecent()
})
</script>

<style scoped>
.card-content {
  display: flex;
  align-items: center;
}
.card-icon {
  font-size: 50px;
  margin-right: 20px;
  color: #409EFF;
}
.card-num {
  font-size: 28px;
  font-weight: bold;
}
.card-text {
  color: #909399;
  font-size: 14px;
}
</style>