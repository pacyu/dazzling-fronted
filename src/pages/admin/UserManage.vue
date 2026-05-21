<template>
  <el-card>
    <div>
      <el-button type="primary" @click="openDialog()">新增用户</el-button>
    </div>
    <el-table :data="list" style="margin-top: 20px">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="avatar" label="头像" />
      <el-table-column prop="role" label="角色" />
      <el-table-column prop="createdAt" label="注册日期" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDialog(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
      <el-form :model="formData" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="formData.username" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email" />
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="formData.avatar" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formData.password" />
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="formData.role" />
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
const formData = ref({ id: null, username: '', email: '', avatar: '', password: '', role: '' })

const loadData = async () => {
  const res = await axios.get('/api/user')
  list.value = res.data
}

const openDialog = (row?: any) => {
  if (row) {
    dialogTitle.value = '编辑用户'
    formData.value = { ...row }
  } else {
    dialogTitle.value = '新增用户'
    formData.value = { id: null, username: '', email: '', avatar: '', password: '', role: '' }
  }
  dialogVisible.value = true
}

const save = async () => {
  if (formData.value.id) {
    await axios.put(`/api/user`, { id: formData.value.id, username: formData.value.username, email: formData.value.email, avatar: formData.value.avatar, password: formData.value.password, role: formData.value.role })
  } else {
    await axios.post('/api/user', { username: formData.value.username, email: formData.value.email, avatar: formData.value.avatar, password: formData.value.password, role: formData.value.role })
  }
  ElMessage.success('保存成功')
  dialogVisible.value = false
  loadData()
}

const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确定删除？', '提示', { type: 'warning' })
  await axios.delete(`/api/user/`, { data: {id: id} })
  ElMessage.success('删除成功')
  loadData()
}

onMounted(loadData)
</script>