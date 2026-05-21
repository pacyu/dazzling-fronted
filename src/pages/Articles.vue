<template>
  <section class="blog-area section">
    <div class="container">
      <div class="all-articles-header">
        <h2><b>📝 全部文章</b></h2>
        <p>记录技术、生活与思考</p>
      </div>

      <div class="row">
        <div class="col-lg-4 col-md-6" v-for="article in articles" :key="article.slug">
          <div class="card h-100">
            <div class="single-post post-style-2 post-style-3">
              <div class="blog-info">
                <h4 class="title">
                  <router-link :to="`/article?v=${article.slug}`"><b>{{ article.title }}</b></router-link>
                </h4>
                <div class="article-meta">
                  <span><i class="ion-calendar"></i> {{ formatDate(article.releasedAt, 'YYYY-MM-DD') }}</span>
                  <span><i class="ion-eye"></i> {{ article.views }} 阅读</span>
                  <span><i class="ion-chatbubble"></i> {{ article.reviews }} 评论</span>
                </div>
                <p>{{ article.introduction }}</p>
                <div class="article-categories" v-if="article.category && article.category.length">
                  <i class="ion-folder"></i>
                  <a v-for="cat in article.category" :key="cat" @click.prevent="goToCategory(cat)">{{ cat }}</a>
                </div>
                <div class="avatar-area">
                  <router-link class="avatar" to="/about">
                    <img src="/blog/images/avatars/icons8-team-355979.png" alt="Profile Image">
                  </router-link>
                  <div class="right-area">
                    <router-link class="name" to="/about"><b>{{ article.author }}</b></router-link>
                    <h6 class="date">{{ formatDate(article.releasedAt) }}</h6>
                  </div>
                </div>
                <ul class="post-footer">
                  <li><a href="javascript:void(0)" @click="handleLike(article.slug)"><i class="ion-heart"></i>{{ article.likes }}</a></li>
                  <li><router-link :to="`/article?v=${article.slug}`"><i class="ion-chatbubble"></i>{{ article.reviews }}</router-link></li>
                  <li><router-link :to="`/article?v=${article.slug}`"><i class="ion-eye"></i>{{ article.views }}</router-link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center" v-if="totalPages > 1">
        <a class="load-more-btn" v-if="page > 0" @click="changePage(page - 1)"><b>« 上一页</b></a>
        <span class="mx-2">第 {{ page + 1 }} / {{ totalPages }} 页</span>
        <a class="load-more-btn" v-if="page < totalPages - 1" @click="changePage(page + 1)"><b>下一页 »</b></a>
      </div>
      <div v-if="!articles.length" class="text-center not-found">暂无文章，请期待后续更新~</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getArticles, likeArticle } from '../api/index'
import { formatDate } from '../utils/date'

const router = useRouter()
const articles = ref<any[]>([])
const page = ref(0)
const totalPages = ref(0)
const size = 6

const loadArticles = async () => {
  const res = await getArticles(page.value, size)
  articles.value = res.data.content
  totalPages.value = res.data.totalPages
}

const changePage = (newPage: number) => {
  page.value = newPage
  loadArticles()
}

const handleLike = async (slug: string) => {
  await likeArticle(slug)
  // 刷新当前页
  loadArticles()
}

const goToCategory = (cat: string) => {
  router.push({ path: '/category', query: { v: cat } })
}

onMounted(loadArticles)
</script>
