<template>
  <nav class="navbar">
    <div class="container nav-inner">
      <!-- Logo -->
      <RouterLink to="/" class="nav-logo">
        <span class="logo-icon">✂</span>
        <span class="logo-text">BeautyBook</span>
      </RouterLink>

      <!-- Desktop Nav Links -->
      <ul class="nav-links">
        <li><RouterLink to="/" class="nav-link">홈</RouterLink></li>
        <li v-if="auth.isStylist">
          <RouterLink to="/stylist/reservations" class="nav-link">예약 관리</RouterLink>
        </li>
        <li v-if="auth.isStylist">
          <RouterLink to="/stylist/manage" class="nav-link">내 프로필 관리</RouterLink>
        </li>
        <li v-if="auth.isLoggedIn">
          <RouterLink to="/mypage" class="nav-link">마이페이지</RouterLink>
        </li>
      </ul>

      <!-- Auth Buttons -->
      <div class="nav-actions">
        <template v-if="!auth.isLoggedIn">
          <RouterLink to="/login" class="btn btn-ghost btn-sm">로그인</RouterLink>
          <RouterLink to="/register" class="btn btn-primary btn-sm">회원가입</RouterLink>
        </template>
        <template v-else>
          <span class="nav-username">{{ auth.user?.name }}</span>
          <button class="btn btn-ghost btn-sm" @click="handleLogout">로그아웃</button>
        </template>

        <!-- Mobile Menu Toggle -->
        <button class="hamburger" @click="mobileOpen = !mobileOpen">
          <span :class="{ active: mobileOpen }"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <Transition name="slide-down">
      <div v-if="mobileOpen" class="mobile-menu">
        <RouterLink to="/" @click="mobileOpen=false">홈</RouterLink>
        <RouterLink v-if="auth.isStylist" to="/stylist/reservations" @click="mobileOpen=false">예약 관리</RouterLink>
        <RouterLink v-if="auth.isStylist" to="/stylist/manage" @click="mobileOpen=false">내 프로필 관리</RouterLink>
        <RouterLink v-if="auth.isLoggedIn" to="/mypage" @click="mobileOpen=false">마이페이지</RouterLink>
        <template v-if="!auth.isLoggedIn">
          <RouterLink to="/login" @click="mobileOpen=false">로그인</RouterLink>
          <RouterLink to="/register" @click="mobileOpen=false">회원가입</RouterLink>
        </template>
        <template v-else>
          <button @click="handleLogout">로그아웃</button>
        </template>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const router = useRouter()
const mobileOpen = ref(false)

async function handleLogout() {
  await auth.logout()
  mobileOpen.value = false
  router.push('/')
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 68px;
  background: #ffffff;
  border-bottom: 1px solid var(--color-border);
}

.nav-inner {
  height: 68px;
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 20px;
  color: var(--color-gold);
  letter-spacing: -0.5px;
  flex-shrink: 0;
}
.logo-icon { font-size: 22px; }

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
  flex: 1;
}

.nav-link {
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: var(--transition);
}
.nav-link:hover, .nav-link.router-link-active {
  color: var(--color-text-primary);
  background: rgba(255,255,255,0.06);
}
.nav-link.router-link-exact-active { color: var(--color-gold); }

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.nav-username {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-gold);
}

/* Hamburger */
.hamburger {
  display: none;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  position: relative;
}
.hamburger span,
.hamburger span::before,
.hamburger span::after {
  position: absolute;
  left: 8px;
  width: 18px;
  height: 1.5px;
  background: var(--color-text-primary);
  transition: var(--transition);
}
.hamburger span { top: 50%; transform: translateY(-50%); }
.hamburger span::before { content: ''; top: -6px; }
.hamburger span::after { content: ''; top: 6px; }
.hamburger span.active { background: transparent; }
.hamburger span.active::before { transform: translateY(6px) rotate(45deg); }
.hamburger span.active::after { transform: translateY(-6px) rotate(-45deg); }

/* Mobile menu */
.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 16px 24px;
  background: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-border);
  gap: 4px;
}
.mobile-menu a, .mobile-menu button {
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-size: 15px;
  color: var(--color-text-secondary);
  text-align: left;
  background: transparent;
  transition: var(--transition);
}
.mobile-menu a:hover, .mobile-menu button:hover {
  color: var(--color-text-primary);
  background: rgba(255,255,255,0.05);
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.25s;
  overflow: hidden;
}
.slide-down-enter-from, .slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}
.slide-down-enter-to, .slide-down-leave-from {
  max-height: 400px;
  opacity: 1;
}

@media (max-width: 768px) {
  .nav-links { display: none; }
  .hamburger { display: flex; align-items: center; justify-content: center; }
  .mobile-menu { display: flex; }
  .nav-actions .btn { display: none; }
  .nav-username { display: none; }
}
</style>
