<template>
  <div>
    <el-card>
      <div class="search-bar">
        <el-input v-model="keyword" placeholder="搜索标题" style="width: 200px" @keyup.enter="search" />
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="success" @click="$router.push('/admin/article/edit')">写文章</el-button>
      </div>
      <el-table :data="articles" border style="margin-top: 20px">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="releasedAt" label="发布日期" width="160">
          <template #default="{ row }">{{ dayjs(row.releasedAt).format('YYYY-MM-DD') }}</template>
        </el-table-column>
        <el-table-column prop="views" label="阅读量" width="100" />
        <el-table-column prop="likes" label="点赞" width="80" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button link type="primary" @click="$router.push(`/admin/article/edit?slug=${row.slug}`)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="loadArticles"
        style="margin-top: 20px; justify-content: center;"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

const articles = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const keyword = ref('')

const loadArticles = async () => {
  const params: any = { page: currentPage.value - 1, size: pageSize.value }
  if (keyword.value) params.title = keyword.value  // 后端需支持标题模糊搜索
  const res = await axios.get('/api/article', { params })
  articles.value = res.data.content
  total.value = res.data.totalElements
}

const search = () => {
  currentPage.value = 1
  loadArticles()
}

const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确定删除该文章吗？', '提示', { type: 'warning' })
  await axios.delete(`/api/article`, { data: { id: id, type: 'delete' } })
  ElMessage.success('删除成功')
  loadArticles()
}

onMounted(loadArticles)
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>