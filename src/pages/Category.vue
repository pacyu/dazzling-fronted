<template>
  <div>
    <div class="main-slider">
      <div class="swiper-container" ref="swiperContainer">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="cat in categories" :key="cat.slug">
            <a class="slider-category" @click.prevent="selectCategory(cat.kind)">
              <div class="blog-image"><img :src="`/images/${cat.bgImage}`" alt="Category Image"></div>
              <div class="category">
                <div class="display-table center-text">
                  <div class="display-table-cell">
                    <h3><b>{{ cat.kind }}</b></h3>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>

    <section class="blog-area section">
      <div class="container">
        <div class="current-category-bar" v-if="currentCategory">
          📂 当前分类：<strong>{{ currentCategory }}</strong>
          <a @click.prevent="clearCategory">查看全部分类</a>
        </div>
        <div class="row">
          <div class="col-lg-4 col-md-6" v-for="article in articles" :key="article.id">
            <!-- 文章卡片，略，复用样式 -->
          </div>
        </div>
        <div class="text-center" v-if="totalPages > 1">
          <a class="load-more-btn" @click="changePage(page-1)" v-if="page > 0">« 上一页</a>
          <span class="mx-2">第 {{ page+1 }} / {{ totalPages }} 页</span>
          <a class="load-more-btn" @click="changePage(page+1)" v-if="page < totalPages-1">下一页 »</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCategories, getArticlesByCategory } from '../api/index'
import Swiper from 'swiper'
import 'swiper/css'

const route = useRoute()
const router = useRouter()
const categories = ref<any[]>([])
const articles = ref<any[]>([])
const currentCategory = ref('')
const page = ref(0)
const totalPages = ref(0)
const size = 6
let swiper: Swiper | null = null

const loadCategories = async () => {
  const data = await getCategories()
  categories.value = data
  await nextTick()
  if (swiper) swiper.destroy(true, true)
  swiper = new Swiper('.swiper-container', {
    slidesPerView: 4,
    spaceBetween: 10,
    loop: categories.value.length > 1,
    autoplay: { delay: 5000 },
    breakpoints: { 640: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }
  })
}

const loadArticles = async () => {
  const cw = currentCategory.value
  const data = await getArticlesByCategory(cw, page.value, size)
  articles.value = data.content
  totalPages.value = data.totalPages
}

const selectCategory = (kind: string) => {
  currentCategory.value = kind
  page.value = 0
  router.push({ query: { cw: kind } })
  loadArticles()
}

const clearCategory = () => {
  currentCategory.value = ''
  page.value = 0
  router.push({ query: {} })
  loadArticles()
}

const changePage = (newPage: number) => {
  page.value = newPage
  loadArticles()
}

onMounted(() => {
  loadCategories()
  const cw = route.query.cw as string
  if (cw) {
    currentCategory.value = cw
  }
  loadArticles()
  watch(() => route.query.cw, (newCw) => {
    currentCategory.value = newCw as string
    page.value = 0
    loadArticles()
  })
})
</script>

<style scoped>
@import '/blog/styles/category/styles.css';
@import '/blog/styles/category/responsive.css';
</style>