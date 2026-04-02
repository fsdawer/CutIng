<template>
  <main class="page auth-page">
    <div class="auth-card card">
      <div class="auth-header">
        <RouterLink to="/" class="auth-logo">✂ BeautyBook</RouterLink>
        <h1 class="auth-title">로그인</h1>
        <p class="auth-sub">서비스를 이용하려면 로그인하세요</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label class="form-label">아이디 또는 이메일</label>
          <input
            v-model="form.username"
            type="text"
            class="form-input"
            placeholder="아이디 또는 이메일 입력"
            required
          />
        </div>
        <div class="form-group">
          <label class="form-label">비밀번호</label>
          <div class="input-wrap">
            <input
              v-model="form.password"
              :type="showPw ? 'text' : 'password'"
              class="form-input"
              placeholder="비밀번호 입력"
              required
            />
            <button type="button" class="pw-toggle" @click="showPw = !showPw">
              {{ showPw ? '숨기기' : '보기' }}
            </button>
          </div>
        </div>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <button type="submit" class="btn btn-primary btn-full btn-lg" :disabled="loading">
          <span v-if="loading" class="spinner" style="width:18px;height:18px;border-width:2px;"></span>
          <span v-else>로그인</span>
        </button>
      </form>

      <div class="divider"><span>또는 소셜 로그인</span></div>

      <div class="social-buttons">
        <a href="http://localhost:8080/oauth2/authorization/kakao" class="btn-kakao">
          <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" alt="카카오" width="20" />
          카카오로 로그인
        </a>
      </div>

      <p class="auth-switch">
        아직 계정이 없으신가요?
        <RouterLink to="/register" class="link-gold">회원가입</RouterLink>
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const form = ref({ username: '', password: '' })
const showPw = ref(false)
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  loading.value = true
  errorMsg.value = ''
  try {
    // 1. 로그인 요청
    const res = await axios.post('http://localhost:8080/api/auth/login', {
      username: form.value.username,
      password: form.value.password
    })
    const token = res.data.accessToken

    // 2. 로그인 성공 시, 내 정보 조회
    const userRes = await axios.get('http://localhost:8080/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })

    // 3. authStore에 저장
    auth.setAuth(userRes.data, token)
    
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (e) {
    errorMsg.value = e.response?.data?.message || '아이디 또는 비밀번호가 올바르지 않습니다.'
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
}
.auth-card {
  width: 100%;
  max-width: 440px;
  padding: 40px;
}
.auth-header { text-align: center; margin-bottom: 32px; }
.auth-logo { font-size: 22px; font-weight: 700; color: var(--color-gold); }
.auth-title { font-size: 24px; font-weight: 700; margin-top: 20px; margin-bottom: 8px; }
.auth-sub { color: var(--color-text-secondary); font-size: 14px; }

.auth-form { display: flex; flex-direction: column; gap: 18px; margin-bottom: 24px; }

.input-wrap { position: relative; }
.input-wrap .form-input { padding-right: 64px; width: 100%; }
.pw-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 12px;
  cursor: pointer;
}
.pw-toggle:hover { color: var(--color-gold); }

.error-msg { color: var(--color-danger); font-size: 13px; text-align: center; }

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0;
  color: var(--color-text-muted);
  font-size: 13px;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-top: 1px solid var(--color-border, #333);
}
.divider span { margin: 0 12px; white-space: nowrap; }

.social-buttons { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }

.btn-kakao {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background-color: #FEE500;
  color: #191919;
  font-weight: 600;
  font-size: 15px;
  border-radius: 8px;
  text-decoration: none;
  transition: opacity 0.2s;
}
.btn-kakao:hover { opacity: 0.85; }

.auth-switch { text-align: center; font-size: 14px; color: var(--color-text-secondary); }
.link-gold { color: var(--color-gold); font-weight: 600; margin-left: 4px; }
.link-gold:hover { text-decoration: underline; }
</style>
