<template>
  <el-card>
    <el-form :model="form" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="简介">
        <el-input type="textarea" v-model="form.introduction" :rows="3" />
      </el-form-item>
      <el-form-item label="封面URL">
        <el-input v-model="form.cover" />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="form.categories" multiple filterable allow-create default-first-option placeholder="请选择分类">
          <el-option v-for="cat in allCategories" :key="cat" :label="cat" :value="cat" />
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-select v-model="form.tags" multiple filterable allow-create default-first-option placeholder="请选择标签">
          <el-option v-for="tag in allTags" :key="tag" :label="tag" :value="tag" />
        </el-select>
      </el-form-item>
      <el-form-item label="正文">
        <div ref="vditorRef"></div>
      </el-form-item>
      <el-form-item label="发布状态">
        <el-radio-group v-model="form.release">
          <el-radio :label="true">发布</el-radio>
          <el-radio :label="false">草稿</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

const route = useRoute()
const router = useRouter()
const vditorRef = ref<HTMLElement>()
let vditor: Vditor

const form = ref({
  id: null as number | null,
  slug: '',
  title: '',
  introduction: '',
  cover: '',
  categories: [] as string[],
  tags: [] as string[],
  content: '',
  release: true
})

const allCategories = ref<string[]>([])
const allTags = ref<string[]>([])

const fetchOptions = async () => {
  const [cats, tags] = await Promise.all([
    axios.get('/api/category'),
    axios.get('/api/tag')
  ])
  allCategories.value = cats.data.map((c: any) => c.kind)
  allTags.value = tags.data.map((t: any) => t.tag)
}

const fetchArticle = async (slug: string) => {
  const res = await axios.get(`/api/article`, { params: {v: slug } })
  const data = res.data
  form.value = {
    id: data.id,
    slug: data.slug,
    title: data.title,
    introduction: data.introduction,
    cover: data.cover,
    categories: data.category || [],
    tags: data.tag || [],
    content: data.content, // 原始 Markdown
    release: data.releasedAt !== null
  }
  if (vditor) vditor.setValue(data.content)
}

const initEditor = () => {
  vditor = new Vditor(vditorRef.value!, {
    height: 500,
    mode: 'sv',
    cache: { enable: false },
    after: () => {
      if (form.value.content) vditor.setValue(form.value.content)
    }
  })
}

const submit = async () => {
  const content = vditor.getValue()
  const data = {
    slug: form.value.slug,
    type: 'update',
    title: form.value.title,
    introduction: form.value.introduction,
    content,
    cover: form.value.cover,
    categories: form.value.categories,
    tags: form.value.tags,
    release: form.value.release
  }
  if (form.value.id) {
    await axios.put(`/api/article`, data)
    ElMessage.success('更新成功')
  } else {
    await axios.post('/api/article', data)
    ElMessage.success('创建成功')
  }
  router.push('/admin/articles')
}

onMounted(async () => {
  await fetchOptions()
  const slug = route.query.slug as string || ''
  if (slug !== '') await fetchArticle(slug)
  initEditor()
})

onBeforeUnmount(() => {
  if (vditor) vditor.destroy()
})
</script>