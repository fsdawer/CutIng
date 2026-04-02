<template>
  <main class="page">
    <div class="container nf-content">
      <div class="nf-icon">✂</div>
      <h1 class="nf-title">404</h1>
      <p class="nf-desc">찾으시는 페이지가 없습니다</p>
      <RouterLink to="/" class="btn btn-primary btn-lg">홈으로 돌아가기</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.nf-content {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: calc(100vh - 200px); text-align: center;
}
.nf-icon { font-size: 64px; color: var(--color-gold); margin-bottom: 16px; opacity: 0.4; }
.nf-title { font-size: 80px; font-weight: 700; color: var(--color-text-muted); line-height: 1; margin-bottom: 12px; }
.nf-desc { font-size: 16px; color: var(--color-text-secondary); margin-bottom: 28px; }
</style>
