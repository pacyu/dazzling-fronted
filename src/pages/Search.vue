<template>
  <section class="blog-area section">
    <div class="container">
      <div v-if="resultType === 'archive'">
        <div class="row">
          <div class="col-lg-4 col-md-6" v-for="article in articles" :key="article.slug">
            <!-- 文章卡片，复用 -->
          </div>
        </div>
        <div class="text-center" v-if="totalPages > 1">
          <a class="load-more-btn" @click="changePage(page-1)" v-if="page > 0">« 上一页</a>
          <span class="mx-2">第 {{ page+1 }} / {{ totalPages }} 页</span>
          <a class="load-more-btn" @click="changePage(page+1)" v-if="page < totalPages-1">下一页 »</a>
        </div>
      </div>
      <div v-else class="text-center not-found">未找到相关文章</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { searchArticles } from '../api/index'

const route = useRoute()
const articles = ref<any[]>([])
const resultType = ref('archive')
const page = ref(0)
const totalPages = ref(0)
const size = 10

const loadSearch = async (keyword: string) => {
  if (!keyword) return
  const res = await searchArticles(keyword, page.value, size)
  articles.value = res.data.content
  totalPages.value = res.data.totalPages
  resultType.value = articles.value.length ? 'archive' : 'notfound'
}

const changePage = (newPage: number) => {
  page.value = newPage
  const q = route.query.q as string
  if (q) loadSearch(q)
}

onMounted(() => {
  const q = route.query.q as string
  if (q) loadSearch(q)
  watch(() => route.query.q, (newQ) => {
    page.value = 0
    if (newQ) loadSearch(newQ as string)
  })
})
</script>