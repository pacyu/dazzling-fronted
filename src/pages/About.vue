<template>
  <div class="slider display-table center-text">
    <h1 class="title display-table-cell"><b>About me</b></h1>
  </div>
  <section class="blog-area section">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-md-12 no-right-padding">
          <div class="post-wrapper" v-if="about">
            <h3 class="title"><router-link :to="`/article/${about.slug}`"><b>{{ about.title }}</b></router-link></h3>
            <div class="para" v-html="renderedContent"></div>
            <div class="post-image"><img :src="`/images/${about.cover}`" alt="About Image"></div>
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
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAboutArticle, getTags } from '../api/index'
import { renderMarkdown } from '../utils/markdown'

const router = useRouter()
const about = ref<any>(null)
const renderedContent = ref('')
const tags = ref<any[]>([])

const loadAbout = async () => {
  const data = await getAboutArticle()
  about.value = data
  renderedContent.value = await renderMarkdown(data.content)
}

const loadTags = async () => {
  const res = await getTags()
  tags.value = res
}

const searchByTag = (tag: string) => {
  router.push({ path: '/search', query: { q: tag } })
}

onMounted(() => {
  loadAbout()
  loadTags()
})
</script>

<style scoped>
@import '/blog/styles/about/styles.css';
@import '/blog/styles/about/responsive.css';
</style>