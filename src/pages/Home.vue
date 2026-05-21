<template>
  <section class="blog-area section">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 col-md-6 no-right-padding" v-for="article in articles" :key="article.slug">
          <div class="card h-100">
            <div class="single-post post-style-2 post-style-3">
              <div class="blog-info">
                <h4 class="title">
                  <router-link :to="`/article?v=${article.slug}`"><b>{{ article.title }}</b></router-link>
                </h4>
                <p>{{ article.introduction }}</p>
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
      <a v-if="hasMore" class="load-more-btn" @click="loadMore"><b>LOAD MORE</b></a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getArticles, likeArticle } from '../api/index'
import { formatDate } from '../utils/date'

const articles = ref<any[]>([])
const page = ref(0)
const hasMore = ref(true)
const size = 6

const fetchArticles = async (reset = false) => {
  try {
    const res = await getArticles(page.value, size)
    const newArticles = res.data.content
    if (reset) articles.value = newArticles
    else articles.value.push(...newArticles)
    hasMore.value = !res.data.last
  } catch (err) {
    console.error(err)
  }
}

const loadMore = () => {
  page.value++
  fetchArticles()
}

const handleLike = async (slug: string) => {
  try {
    await likeArticle(slug)
    // 局部更新点赞数
    await fetchArticles(true)
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchArticles(true)
})
</script>