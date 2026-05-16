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
                  <h6 class="date">{{ formatDate(article.releaseDate) }}</h6>
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
                  <li v-if="article.updateDate">最近编辑时间 : </li>
                  <li><p><i class="ion-social-edit"></i>{{ formatDate(article.updateDate) }}</p></li>
                </ul>
              </div>
              <!-- 评论列表和表单（略，可独立为 CommentSection 组件） -->
            </div>
          </div>
        </div>
        <div class="col-lg-4 col-md-12 no-left-padding">
          <div class="single-post info-area">
            <div class="tag-area">
              <h4 class="title"><b>TAG CLOUD</b></h4>
              <ul>
                <li v-for="tag in tags" :key="tag.id"><a @click.prevent="searchByTag(tag.tag)">{{ tag.tag }}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticleBySlug, likeArticle, viewArticle, getTags } from '../api/index'
import { renderMarkdown } from '../utils/markdown'
import { formatDate } from '../utils/date'

const route = useRoute()
const router = useRouter()
const article = ref<any>(null)
const renderedContent = ref('')
const tags = ref<any[]>([])

const coverUrl = computed(() => article.value?.cover ? `/images/${article.value.cover}` : '/images/default-cover.jpg')

const loadArticle = async () => {
  const slug = route.params.slug
  const data = await getArticleBySlug(slug)
  article.value = data
  renderedContent.value = await renderMarkdown(data.content)
  // 增加浏览量（可选）
  await viewArticle(slug).catch(() => {})
  // 触发 MathJax
  if (window.MathJax) {
    setTimeout(() => window.MathJax?.typesetPromise(), 100)
  }
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
  const data = await getTags()
  console.log(data)
  tags.value = data
}

onMounted(() => {
  loadArticle()
  loadTags()
  watch(() => route.params.id, loadArticle)
})
</script>

<style scoped>
@import '/blog/styles/detail/styles.css';
@import '/blog/styles/detail/responsive.css';
</style>