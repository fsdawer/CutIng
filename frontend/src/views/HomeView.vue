<template>
  <main class="page">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="container hero-content">
        <p class="hero-label">당신만을 위한 스타일</p>
        <h1 class="hero-title">최고의 미용사를<br />내 손안에서 찾다</h1>
        <p class="hero-desc">서울 전역의 베스트 스타일리스트와 연결하세요</p>
        <div class="hero-search">
          <input
            v-model="searchQuery"
            class="form-input"
            placeholder="미용사 이름, 미용실 검색..."
            @keyup.enter="search"
          />
          <input
            v-model="locationQuery"
            class="form-input location-input"
            placeholder="지역 (예: 강남)"
            @keyup.enter="search"
          />
          <button class="btn btn-primary" @click="search">검색</button>
        </div>
        <div class="hero-tags">
          <button
            v-for="tag in popularTags"
            :key="tag"
            class="tag-chip"
            @click="searchQuery = tag; search()"
          >{{ tag }}</button>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <div class="container">
      <div class="filter-bar">
        <div class="filter-chips">
          <button
            v-for="f in filters"
            :key="f.value"
            class="filter-chip"
            :class="{ active: activeFilter === f.value }"
            @click="activeFilter = f.value"
          >{{ f.label }}</button>
        </div>
        <div class="filter-right">
          <select v-model="sortBy" class="form-input" style="width:auto;padding:8px 12px;font-size:13px;">
            <option value="rating">평점순</option>
            <option value="review">리뷰순</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p style="color:var(--color-text-muted);margin-top:16px">스타일리스트를 불러오는 중...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="empty-state">
        <div class="empty-icon">⚠️</div>
        <p class="empty-text">{{ error }}</p>
        <button class="btn btn-ghost" @click="fetchStylists()">다시 시도</button>
      </div>

      <!-- Stylist Grid -->
      <div v-else class="stylists-grid">
        <StylistCard
          v-for="stylist in filteredStylists"
          :key="stylist.id"
          :stylist="stylist"
        />
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && filteredStylists.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <p class="empty-text">검색 결과가 없습니다</p>
        <button class="btn btn-ghost" @click="resetSearch">필터 초기화</button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StylistCard from '@/components/StylistCard.vue'
import { stylistApi } from '@/api/stylist'

const searchQuery = ref('')
const locationQuery = ref('')
const activeFilter = ref('all')
const sortBy = ref('rating')
const loading = ref(false)
const error = ref('')

const popularTags = ['헤어컷', '펌', '염색', '드라이', '케라틴']
const filters = [
  { label: '전체', value: 'all' },
  { label: '헤어컷', value: '헤어컷' },
  { label: '펌', value: '펌' },
  { label: '염색', value: '염색' },
  { label: '케라틴', value: '케라틴' },
  { label: '드라이', value: '드라이' },
]

const stylists = ref([])

onMounted(() => fetchStylists())

async function fetchStylists(keyword = '', location = '') {
  loading.value = true
  error.value = ''
  try {
    const params = {}
    if (keyword) params.keyword = keyword
    if (location) params.location = location
    const res = await stylistApi.getStylists(params)
    stylists.value = res.data
  } catch (e) {
    error.value = '스타일리스트 목록을 불러오지 못했습니다.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const filteredStylists = computed(() => {
  let list = stylists.value

  if (activeFilter.value !== 'all') {
    list = list.filter(s =>
      s.services?.some(svc => svc.name?.includes(activeFilter.value))
    )
  }

  if (sortBy.value === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
  else if (sortBy.value === 'review') list = [...list].sort((a, b) => b.reviewCount - a.reviewCount)

  return list
})

function search() {
  fetchStylists(searchQuery.value.trim(), locationQuery.value.trim())
}
function resetSearch() {
  searchQuery.value = ''
  locationQuery.value = ''
  activeFilter.value = 'all'
  fetchStylists()
}
</script>

<style scoped>
/* Hero */
.hero {
  position: relative;
  padding: 80px 0 60px;
  overflow: hidden;
  margin-bottom: 32px;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background: var(--color-bg-surface);
}
.hero-content {
  position: relative;
  text-align: center;
  max-width: 680px;
  margin: 0 auto;
}
.hero-label {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-gold);
  margin-bottom: 16px;
}
.hero-title {
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 16px;
  color: var(--color-text-primary);
}
.hero-desc {
  font-size: 16px;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
}
.hero-search {
  display: flex;
  gap: 12px;
  max-width: 580px;
  margin: 0 auto 20px;
}
.hero-search .form-input { flex: 1; }
.location-input { max-width: 160px; flex: none !important; }
.hero-tags {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}
.tag-chip {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 13px;
  transition: var(--transition);
}
.tag-chip:hover {
  border-color: var(--color-gold);
  color: var(--color-gold);
}

/* Filters */
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}
.filter-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-chip {
  padding: 8px 18px;
  border-radius: var(--radius-full);
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  transition: var(--transition);
}
.filter-chip:hover { border-color: var(--color-gold); color: var(--color-gold); }
.filter-chip.active {
  background: linear-gradient(135deg, var(--color-gold), var(--color-gold-dark));
  border-color: transparent;
  color: #1a1206;
  font-weight: 600;
}

/* Grid */
.stylists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  padding-bottom: 60px;
}

/* Loading */
.loading-state { text-align: center; padding: 80px 0; }

/* Empty */
.empty-state {
  text-align: center;
  padding: 80px 0;
}
.empty-icon { font-size: 48px; margin-bottom: 16px; }
.empty-text { color: var(--color-text-secondary); margin-bottom: 20px; font-size: 16px; }

@media (max-width: 768px) {
  .hero { padding: 48px 0 40px; }
  .hero-search { flex-direction: column; }
  .location-input { max-width: 100%; }
  .filter-right { display: none; }
}
</style>
