<template>
  <el-card>
    <div>
      <el-button type="primary" @click="openDialog()">新增评论</el-button>
    </div>
    <el-table :data="list" style="margin-top: 20px">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="articleId" label="文章ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="articleSlug" label="文章Slug" />
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="createdAt" label="日期" />
      <el-table-column prop="updatedAt" label="更新日期" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDialog(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
      <el-form :model="formData" label-width="80px">
        <el-form-item label="文章ID">
          <el-input v-model="formData.articleId" />
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="formData.userId" />
        </el-form-item>
        <el-form-item label="文章Slug">
          <el-input v-model="formData.articleSlug" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="formData.content" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const list = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formData = ref({ id: null, articleId: null, userId: null, articleSlug: '', content: '' })

const loadData = async () => {
  const res = await axios.get('/api/comment?page=0&size=5&sort=createdAt,desc')
  list.value = res.data.content
}

const openDialog = (row?: any) => {
  if (row) {
    dialogTitle.value = '编辑评论'
    formData.value = { ...row }
  } else {
    dialogTitle.value = '新增评论'
    formData.value = { id: null, articleId: null, userId: null, articleSlug: '', content: '' }
  }
  dialogVisible.value = true
}

const save = async () => {
  if (formData.value.id) {
    await axios.put(`/api/comment`, { id: formData.value.id, artilceId: formData.value.articleId, userId: formData.value.userId, articleSlug: formData.value.articleSlug, content: formData.value.content })
  } else {
    await axios.post('/api/comment', { artilceId: formData.value.articleId, userId: formData.value.userId, articleSlug: formData.value.articleSlug, content: formData.value.content })
  }
  ElMessage.success('保存成功')
  dialogVisible.value = false
  loadData()
}

const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确定删除？', '提示', { type: 'warning' })
  await axios.delete(`/api/comment`, { data: { id } })
  ElMessage.success('删除成功')
  loadData()
}

onMounted(loadData)
</script>