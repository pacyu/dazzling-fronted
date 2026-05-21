<template>
  <el-card>
    <div>
      <el-button type="primary" @click="openDialog()">新增分类</el-button>
    </div>
    <el-table :data="list" style="margin-top: 20px">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="cover" label="背景图" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDialog(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
      <el-form :model="formData" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="背景图">
          <el-input v-model="formData.cover" />
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
const formData = ref({ id: null, slug: '', name: '', cover: '' })

const loadData = async () => {
  const res = await axios.get('/api/category')
  list.value = res.data
}

const openDialog = (row?: any) => {
  if (row) {
    dialogTitle.value = '编辑分类'
    formData.value = { ...row }
  } else {
    dialogTitle.value = '新增分类'
    formData.value = { id: null, slug: '', name: '', cover: '' }
  }
  dialogVisible.value = true
}

const save = async () => {
  if (formData.value.id) {
    await axios.put(`/api/category`, { v: formData.value.slug, name: formData.value.name, cover: formData.value.cover })
  } else {
    await axios.post('/api/category', { name: formData.value.name, cover: formData.value.cover })
  }
  ElMessage.success('保存成功')
  dialogVisible.value = false
  loadData()
}

const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确定删除？', '提示', { type: 'warning' })
  await axios.delete(`/api/category`, { data: { id: id } })
  ElMessage.success('删除成功')
  loadData()
}

onMounted(loadData)
</script>