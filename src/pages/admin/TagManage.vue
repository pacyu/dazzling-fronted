<template>
  <el-card>
    <div>
      <el-button type="primary" @click="openDialog()">新增标签</el-button>
    </div>
    <el-table :data="list" style="margin-top: 20px">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="kind" label="名称" />
      <el-table-column prop="bgImage" label="背景图" />
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
          <el-input v-model="formData.kind" />
        </el-form-item>
        <el-form-item label="背景图">
          <el-input v-model="formData.bgImage" />
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
const formData = ref({ id: null, kind: '', bgImage: '' })

const loadData = async () => {
  const res = await axios.get('/api/tag')
  list.value = res.data
}

const openDialog = (row?: any) => {
  if (row) {
    dialogTitle.value = '编辑用户'
    formData.value = { ...row }
  } else {
    dialogTitle.value = '新增用户'
    formData.value = { id: null, kind: '', bgImage: '' }
  }
  dialogVisible.value = true
}

const save = async () => {
  if (formData.value.id) {
    await axios.put(`/api/tag/${formData.value.id}`, { kindName: formData.value.kind, bgImage: formData.value.bgImage })
  } else {
    await axios.post('/api/tag', { kindName: formData.value.kind, bgImage: formData.value.bgImage })
  }
  ElMessage.success('保存成功')
  dialogVisible.value = false
  loadData()
}

const handleDelete = async (id: number) => {
  await ElMessageBox.confirm('确定删除？', '提示', { type: 'warning' })
  await axios.delete(`/api/tag/${id}`)
  ElMessage.success('删除成功')
  loadData()
}

onMounted(loadData)
</script>