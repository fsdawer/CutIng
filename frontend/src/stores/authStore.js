import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || null)

  const isLoggedIn = computed(() => !!token.value)
  const isStylist = computed(() => user.value?.role === 'STYLIST')

  function setAuth(userData, accessToken) {
    user.value = userData
    token.value = accessToken
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', accessToken)
  }

  async function logout() {
    try {
      // 서버에 로그아웃 알림 (토큰 무효화)
      if (token.value) await authApi.logout()
    } catch (_) {
      // 실패해도 로컬 상태는 클리어
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }

  return { user, token, isLoggedIn, isStylist, setAuth, logout }
})
