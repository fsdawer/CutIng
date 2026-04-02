<template>
  <main class="page auth-page">
    <div class="auth-card card">
      <div class="auth-header">
        <RouterLink to="/" class="auth-logo">✂ BeautyBook</RouterLink>
        <h1 class="auth-title">회원가입</h1>
        <p class="auth-sub">역할을 선택하고 계정을 만드세요</p>
      </div>



      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label class="form-label">아이디</label>
          <input v-model="form.username" type="text" class="form-input" placeholder="영문/숫자 3자 이상" required minlength="3" maxlength="50" />
        </div>
        <div class="form-group">
          <label class="form-label">이름</label>
          <input v-model="form.name" type="text" class="form-input" placeholder="홍길동" required />
        </div>
        <div class="form-group">
          <label class="form-label">이메일</label>
          <input v-model="form.email" type="email" class="form-input" placeholder="example@email.com" required />
        </div>
        <div class="form-group">
          <label class="form-label">핸드폰 번호</label>
          <input v-model="form.phone" type="tel" class="form-input" placeholder="010-XXXX-XXXX" />
        </div>
        <div class="form-group">
          <label class="form-label">비밀번호</label>
          <input v-model="form.password" type="password" class="form-input" placeholder="8자 이상" required minlength="8" />
        </div>
        <div class="form-group">
          <label class="form-label">비밀번호 확인</label>
          <input v-model="form.passwordConfirm" type="password" class="form-input" placeholder="비밀번호 재입력" required />
        </div>



        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <button type="submit" class="btn btn-primary btn-full btn-lg" :disabled="loading">
          <span v-if="loading" class="spinner" style="width:18px;height:18px;border-width:2px;"></span>
          <span v-else>회원가입</span>
        </button>
      </form>

      <p class="auth-switch">
        이미 계정이 있으신가요?
        <RouterLink to="/login" class="link-gold">로그인</RouterLink>
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const errorMsg = ref('')

const form = ref({
  username: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: '',
})

async function handleRegister() {
  if (form.value.password !== form.value.passwordConfirm) {
    errorMsg.value = '비밀번호가 일치하지 않습니다.'
    return
  }
  loading.value = true
  errorMsg.value = ''
  try {
    await axios.post('http://localhost:8080/api/auth/register', {
      username: form.value.username,
      email:    form.value.email,
      phone:    form.value.phone,
      password: form.value.password,
      name:     form.value.name,
      role:     'USER',
    })
    alert('회원가입 성공! 이메일 인증 후 로그인하세요.')
    router.push('/login')
  } catch (e) {
    errorMsg.value = e.response?.data?.message || '회원가입 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 68px);
  padding: 40px 0;
}
.auth-card {
  width: 100%;
  max-width: 480px;
  padding: 40px;
}
.auth-header { text-align: center; margin-bottom: 28px; }
.auth-logo { font-size: 22px; font-weight: 700; color: var(--color-gold); }
.auth-title { font-size: 24px; font-weight: 700; margin-top: 20px; margin-bottom: 8px; }
.auth-sub { color: var(--color-text-secondary); font-size: 14px; }

.auth-form { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; }

.error-msg { color: var(--color-danger); font-size: 13px; text-align: center; }
.auth-switch { text-align: center; font-size: 14px; color: var(--color-text-secondary); }
.link-gold { color: var(--color-gold); font-weight: 600; margin-left: 4px; }
.link-gold:hover { text-decoration: underline; }
</style>
