<template>
  <section class="comment-section center-text">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-md-12" id="js-comment-area-move">
          <h4><b>讨论区</b></h4>

          <div class="comment-form">
            <form @submit.prevent="submitTopComment">
              <div class="row">
                <div class="col-sm-6">
                  <input
                    type="text"
                    v-model="commentForm.name"
                    class="form-control"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div class="col-sm-6">
                  <input
                    type="email"
                    v-model="commentForm.email"
                    class="form-control"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div class="col-sm-12">
                  <textarea
                    v-model="commentForm.message"
                    rows="2"
                    class="text-area-messge form-control"
                    placeholder="Enter your comment"
                    required
                  ></textarea>
                </div>
                <div class="col-sm-12">
                  <button class="submit-btn" type="submit"><b>发送评论</b></button>
                </div>
              </div>
            </form>
          </div>

          <h4><b>评论 ({{ totalComments }})</b></h4>

          <div class="commnets-area text-left">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="comment"
            >
              <!-- 主评论内容 -->
              <div class="post-info">
                <div class="left-area">
                  <a class="avatar" href="#">
                    <img src="/images/icons8-team-355979.png" alt="Profile Image" />
                  </a>
                </div>
                <div class="middle-area">
                  <a class="name" href="#"><b>{{ comment.username }}</b></a>
                  <h6 class="date">{{ formatDate(comment.createdAt) }}</h6>
                </div>
                <div class="right-area">
                  <h5 class="reply-btn">
                    <a
                      href="javascript:void(0)"
                      @click="toggleReplyForm(comment)"
                    >
                      <b>评论</b>
                    </a>
                  </h5>
                </div>
                <div class="reply-content-wrapper">
                  <p v-html="comment.content"></p>
                </div>
              </div>

              <!-- 回复表单（主评论下方） -->
              <div
                v-if="comment.showReplyForm"
                class="comment-form reply-form-inline"
              >
                <form @submit.prevent="submitReplyComment(comment)">
                  <div class="row">
                    <div class="col-sm-6">
                      <input
                        type="text"
                        v-model="replyForm.name"
                        class="form-control"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div class="col-sm-6">
                      <input
                        type="email"
                        v-model="replyForm.email"
                        class="form-control"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div class="col-sm-12">
                      <textarea
                        v-model="replyForm.message"
                        rows="2"
                        class="text-area-messge form-control"
                        placeholder="回复内容"
                        required
                      ></textarea>
                    </div>
                    <div class="col-sm-12">
                      <button class="submit-btn" type="submit"><b>发送</b></button>
                      <button type="button" class="cancel-btn" @click="closeReplyForm(comment)"><b>取消</b></button>
                    </div>
                  </div>
                </form>
              </div>

              <!-- 子回复列表 -->
              <div
                v-for="reply in comment.replies"
                :key="reply.id"
                class="comment"
              >
                
                <div class="post-info">
                  <div class="left-area">
                    <a class="avatar" href="#">
                      <img src="/images/icons8-team-355979.png" alt="Profile Image" />
                    </a>
                  </div>
                  <div class="middle-area">
                    <a class="name" href="#"><b>{{ reply.username }}</b></a>
                    <h6 class="date">{{ formatDate(reply.createdAt) }}</h6>
                  </div>
                  <div class="right-area">
                    <h5 class="reply-btn">
                      <a
                        href="javascript:void(0)"
                        @click="toggleReplyForm(reply)"
                      >
                        <b>评论</b>
                      </a>
                    </h5>
                  </div>
                  <div class="reply-content-wrapper">
                    <h6 class="reply-for">
                      回复 @<a href="javascript:void(0)"><b>{{ reply.username }}:</b></a>
                    </h6>
                    <p v-html="reply.content"></p>
                  </div>
                </div>
                
                <!-- 回复表单（子回复下方） -->
                <div
                  v-if="reply.showReplyForm"
                  class="comment-form reply-form-inline"
                >
                  <form @submit.prevent="submitReplyComment(reply)">
                    <div class="row">
                      <div class="col-sm-6">
                        <input
                          type="text"
                          v-model="replyForm.name"
                          class="form-control"
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                      <div class="col-sm-6">
                        <input
                          type="email"
                          v-model="replyForm.email"
                          class="form-control"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div class="col-sm-12">
                        <textarea
                          v-model="replyForm.message"
                          rows="2"
                          class="text-area-messge form-control"
                          placeholder="回复内容"
                          required
                        ></textarea>
                      </div>
                      <div class="col-sm-12">
                        <button class="submit-btn" type="submit"><b>发送</b></button>
                        <button type="button" class="cancel-btn" @click="closeReplyForm(reply)"><b>取消</b></button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <a
            v-if="hasMore"
            href="javascript:void(0)"
            class="more-comment-btn"
            @click="loadMoreComments"
          >
            <b>VIEW MORE COMMENTS</b>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { getComments, submitComment, type CommentItem, type SubmitCommentParams } from '../api/index'
import { formatDate } from '../utils/date'

const props = defineProps<{
  articleSlug: string    // 文章Slug
  initialTotal?: number  // 初始评论总数
}>()

const emit = defineEmits<{
  (e: 'update:totalComments', total: number): void
}>()

// 评论列表数据
const comments = ref<CommentItem[]>([])
const currentPage = ref(1)
const totalComments = ref(props.initialTotal || 0)
const hasMore = ref(true)
const isLoading = ref(false)

// 顶部评论表单
const commentForm = reactive({
  name: '',
  email: '',
  message: ''
})

// 回复表单（独立数据，避免相互干扰）
const replyForm = reactive({
  name: '',
  email: '',
  message: ''
})

const countTotalComments = (commentsList: CommentItem[]): number => {
  let total = commentsList.length
  for (const comment of commentsList) {
    if (comment.replies && comment.replies.length) {
      total += countTotalComments(comment.replies)
    }
  }
  return total
}

// 加载评论列表
const fetchComments = async (page: number, append = false) => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    const res = await getComments(props.articleSlug)
    const newComments = res.data || []
    if (append) {
      comments.value.push(...newComments)
    } else {
      comments.value = newComments
    }

    totalComments.value = countTotalComments(comments.value)
    hasMore.value = false
    currentPage.value = page
    emit('update:totalComments', totalComments.value)
  } catch (error) {
    console.error('加载评论失败', error)
  } finally {
    isLoading.value = false
  }
}

const toggleReplyForm = (comment: CommentItem) => {
  const closeAll = (items: CommentItem[]) => {
    items.forEach(item => {
      item.showReplyForm = false
      if (item.replies) closeAll(item.replies)
    })
  }
  closeAll(comments.value)

  comment.showReplyForm = true
  // 清空回复表单内容
  replyForm.name = commentForm.name || ''   // 复用已填写的姓名（可选）
  replyForm.email = commentForm.email || ''
  replyForm.message = ''
}

// 关闭回复表单
const closeReplyForm = (comment: CommentItem) => {
  comment.showReplyForm = false
  replyForm.name = ''
  replyForm.email = ''
  replyForm.message = ''
}

const submitTopComment = async () => {
  if (!commentForm.name || !commentForm.email || !commentForm.message) {
    alert('请完整填写姓名、邮箱和评论内容')
    return
  }
  const params: SubmitCommentParams = {
    slug: props.articleSlug,
    username: commentForm.name,
    email: commentForm.email,
    content: commentForm.message,
    parentId: null
  }
  try {
    await submitComment(params)
    commentForm.name = ''
    commentForm.email = ''
    commentForm.message = ''
    // 重新加载评论（回到第一页）
    await fetchComments(1, false)
  } catch (error) {
    console.error('提交评论失败', error)
    alert('提交失败，请稍后再试')
  }
}

// 提交回复评论
const submitReplyComment = async (parentComment: CommentItem) => {
  if (!replyForm.name || !replyForm.email || !replyForm.message) {
    alert('请完整填写姓名、邮箱和回复内容')
    return
  }

  const params: SubmitCommentParams = {
    slug: props.articleSlug,
    username: replyForm.name,
    email: replyForm.email,
    content: replyForm.message,
    parentId: parentComment.id
  }

  try {
    await submitComment(params)
    closeReplyForm(parentComment)
    // 重新加载评论，保持当前页（但可能需要刷新回复列表）
    await fetchComments(currentPage.value, false)
  } catch (error) {
    console.error('提交回复失败', error)
    alert('回复失败，请稍后再试')
  }
}

// 加载更多
const loadMoreComments = () => {
  if (!hasMore.value || isLoading.value) return
  fetchComments(currentPage.value + 1, true)
}

// 监听文章Slug变化，重新加载
watch(() => props.articleSlug, () => {
  currentPage.value = 1
  fetchComments(1, false)
}, { immediate: true })

onMounted(() => {
  fetchComments(1, false)
})
</script>

<style scoped>
@import '/blog/styles/detail/styles.css';
@import '/blog/styles/detail/responsive.css';

.comment .post-info > div:last-child {
  clear: both;           /* 清除上方浮动 */
  padding-top: 15px;     /* 与上方内容拉开距离 */
  padding-left: 90px;    /* 与头像左侧对齐（与 middle-area 的 padding-left 一致） */
}

/* 回复标题左对齐，并调整边距 */
.comment .reply-for {
  text-align: left;
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* 回复内容样式 */
.comment .post-info p {
  margin: 0;
  text-align: left;
  line-height: 1.6;
}

.cancel-btn {
  margin-left: 12px;
}
</style>