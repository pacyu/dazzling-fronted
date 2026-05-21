<template>
  <section class="blog-area section">
    <div class="container">
      <div v-if="resultType === 'article'">
        <div class="row">
          <div class="col-lg-4 col-md-6" v-for="article in articles" :key="article.slug">
            <div class="card h-100">
              <div class="single-post post-style-1">
                <div class="blog-image">
                  <img :src="article.cover ? `/images/${article.cover}` : '/images/default-cover.jpg'" alt="Blog Image" />
                </div>
                <a class="avatar" href="javascript:void(0)">
                  <img src="/images/icons8-team-355979.png" alt="Profile Image" />
                </a>
                <div class="blog-info">
                  <h4 class="title">
                    <a @click.prevent="goToArticle(article.slug)"><b>{{ article.title }}</b></a>
                  </h4>
                  <p>{{ formatDate(article.createdAt) }}</p>
                  <p>{{ article.introduction }}</p>
                  <ul class="post-footer">
                    <li><a @click.prevent="likeArticle(article.slug)"><i class="ion-heart"></i>{{ article.likes }}</a></li>
                    <li><a @click.prevent="goToArticle(article.slug)"><i class="ion-chatbubble"></i>{{ article.reviews }}</a></li>
                    <li><a @click.prevent="goToArticle(article.slug)"><i class="ion-eye"></i>{{ article.views }}</a></li>
                  </ul>
                </div>
              </div>
            </div>
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
import { useRoute, useRouter } from 'vue-router'
import { searchArticles, likeArticle } from '../api/index'
import { formatDate } from '../utils/date'

const route = useRoute()
const router = useRouter()
const articles = ref<any[]>([])
const resultType = ref('article')
const page = ref(0)
const totalPages = ref(0)
const size = 10

const loadSearch = async (keyword: string) => {
  if (!keyword) return
  const res = await searchArticles(keyword, page.value, size)
  articles.value = res.data.content
  totalPages.value = res.data.totalPages
  resultType.value = articles.value.length ? 'article' : 'notfound'
}

const changePage = (newPage: number) => {
  page.value = newPage
  const q = route.query.q as string
  if (q) loadSearch(q)
}

const goToArticle = (slug: string) => {
  router.push({ path: '/article', query: { v: slug } })
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

<style scoped>
@import '/blog/styles/detail/styles.css';
@import '/blog/styles/detail/responsive.css';
</style>