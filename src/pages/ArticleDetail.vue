<template>
  <div class="post-area section">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-md-12 no-right-padding">
          <div class="main-post" v-if="article">
            <div class="post-top-area">
              <h3 class="title"><b>{{ article.title }}</b></h3>
              <div class="post-info">
                <div class="left-area">
                  <a class="avatar"><img src="/images/icons8-team-355979.png" alt="Profile Image"></a>
                </div>
                <div class="middle-area">
                  <router-link class="name" to="/about"><b>{{ article.author }}</b></router-link>
                  <h6 class="date">{{ formatDate(article.releasedAt) }}</h6>
                </div>
              </div>
              <div class="para" v-html="renderedContent"></div>
            </div>
            <div class="post-image"><img :src="coverUrl" alt="Blog Image"></div>
            <div class="post-bottom-area">
              <ul class="tags">
                <li v-for="tag in article.tag" :key="tag"><a @click.prevent="searchByTag(tag)">{{ tag }}</a></li>
              </ul>
              <div class="post-icons-area">
                <ul class="post-icons">
                  <li><a href="javascript:void(0)" @click="handleLike"><i class="ion-heart"></i>{{ article.likes }}</a></li>
                  <li><a href="javascript:void(0)"><i class="ion-chatbubble"></i>{{ article.reviews }}</a></li>
                  <li><a href="javascript:void(0)"><i class="ion-eye"></i>{{ article.views }}</a></li>
                </ul>
                <ul class="icons">
                  <li v-if="article.updatedAt">最近编辑时间 : </li>
                  <li v-if="article.updatedAt"><p><i class="ion-social-edit"></i>{{ formatDate(article.updatedAt) }}</p></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-12 no-left-padding">
          <div class="single-post info-area">
            <div class="tag-area">
              <h4 class="title"><b>TAG CLOUD</b></h4>
              <ul>
                <li v-for="tag in tags" :key="tag.id"><a @click.prevent="searchByTag(tag.name)">{{ tag.name }}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <CommentArea v-if="article && article.slug"
    :article-slug="article?.slug" 
    :initial-total="article?.reviews || 0"
    @update:total-comments="handleTotalCommentsUpdate"
  />

  <section class="recomended-area section" v-if="relatedArticles.length">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 col-md-6" v-for="article in relatedArticles" :key="article.slug">
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
    </div>
  </section>

</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticleBySlug, getRelatedArticles, likeArticle, viewArticle, getTags } from '../api/index'
import { renderMarkdown } from '../utils/markdown'
import { formatDate } from '../utils/date'
import CommentArea from '../components/CommentArea.vue'

const route = useRoute()
const router = useRouter()
const article = ref<any>(null)
const renderedContent = ref('')
const tags = ref<any[]>([])
const relatedArticles = ref<any[]>([])

const coverUrl = computed(() => article.value?.cover ? `/images/${article.value.cover}` : '/images/default-cover.jpg')

const loadArticle = async () => {
  const slug = route.query.v?.toString() || ''
  const res = await getArticleBySlug(slug)
  article.value = res.data
  renderedContent.value = await renderMarkdown(res.data.content)
  // 增加浏览量
  await viewArticle(slug).catch(() => {})

  // 触发 MathJax
  if (window.MathJax) {
    setTimeout(() => window.MathJax?.typesetPromise(), 100)
  }

  if (res.data.slug) {
    loadRelatedArticles(res.data.slug)
  }
}

const loadRelatedArticles = async (articleSlug: string) => {
  try {
    const res = await getRelatedArticles(articleSlug)
    relatedArticles.value = [res.data]
  } catch (error) {
    console.error('加载推荐文章失败', error)
    relatedArticles.value = []
  }
}

const goToArticle = (slug: string) => {
  router.push({ path: '/article', query: { v: slug } })
}

const handleLike = async () => {
  if (!article.value) return
  await likeArticle(article.value.slug)
  article.value.likes += 1
}

const searchByTag = (tag: string) => {
  router.push({ path: '/search', query: { q: tag } })
}

const loadTags = async () => {
  const res = await getTags()
  tags.value = res.data
}

const handleTotalCommentsUpdate = (newTotal: number) => {
  if (article.value) {
    article.value.reviews = newTotal
  }
}

onMounted(() => {
  loadArticle()
  loadTags()
  watch(() => route.params.slug, loadArticle)
})
</script>

<style scoped>
@import '/blog/styles/detail/styles.css';
@import '/blog/styles/detail/responsive.css';
</style>