<template>
  <section class="center-text">
    <div class="container">
      <div class="row">
        <div class="col-lg-2"></div>
        <div class="col-lg-8">
          <div class="login-form">
            <h2><b>Sign in</b></h2>
            <div v-if="error" class="alert alert-danger">用户名或密码错误。</div>
            <div v-if="logout" class="alert alert-info">您已注销。</div>
            <form @submit.prevent="submitLogin">
              <div class="row">
                <div class="col-sm-6"><input class="form-control" type="text" v-model="username" placeholder="管理员账号" required/></div>
                <div class="col-sm-6"><input class="form-control" type="password" v-model="password" placeholder="密码" required/></div>
                <div class="col-sm-12"><input class="submit-btn" type="submit" value="登录"/></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login } from '../api/auth'

const router = useRouter()
const route = useRoute()
const username = ref('')
const password = ref('')
const error = ref(false)
const logout = ref(false)

const submitLogin = async () => {
  try {
    await login(username.value, password.value)
    // 登录成功，跳转到之前访问的页面或后台
    const redirect = (route.query.redirect as string) || '/admin/dashboard'
    console.log("===>", redirect)
    await router.push(redirect)
  } catch (err) {
    error.value = true
  }
}

onMounted(() => {
  if (route.query.error) error.value = true
  if (route.query.logout) logout.value = true
})
</script>
