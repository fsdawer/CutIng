<template>
  <main class="page">
    <div class="container">
      <div class="page-header">
        <div>
          <h1 class="section-title">예약 관리</h1>
          <p class="section-subtitle">고객 예약 목록을 확인하고 상태를 변경하세요</p>
        </div>
        <RouterLink to="/stylist/manage" class="btn btn-ghost">← 프로필 관리</RouterLink>
      </div>

      <!-- Status Filter Tabs -->
      <div class="tab-bar">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="tab-btn"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
          <span v-if="countByStatus(tab.value)" class="tab-count">{{ countByStatus(tab.value) }}</span>
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" style="text-align:center;padding:80px 0">
        <div class="spinner"></div>
        <p style="color:var(--color-text-muted);margin-top:16px">예약 목록을 불러오는 중...</p>
      </div>

      <!-- Reservation List -->
      <div v-else class="reservation-list">
        <div
          v-for="r in filteredReservations"
          :key="r.id"
          class="card reservation-card"
        >
          <div class="rc-main">
            <div class="rc-left">
              <div class="rc-meta">
                <span class="badge" :class="statusBadge(r.status)">{{ statusLabel(r.status) }}</span>
                <span class="rc-id">#{{ r.id }}</span>
              </div>
              <h3 class="rc-service">{{ r.serviceName }}</h3>
              <p class="rc-date">📅 {{ formatDate(r.reservedAt) }}</p>
              <p class="rc-price">💰 {{ r.totalPrice?.toLocaleString() }}원</p>
            </div>
            <div class="rc-right">
              <div class="rc-actions" v-if="r.status === 'CONFIRMED'">
                <button class="btn btn-primary btn-sm" @click="updateStatus(r.id, 'DONE')">
                  완료 처리
                </button>
                <RouterLink v-if="r.chatRoomId" :to="`/chat/${r.chatRoomId}`" class="btn btn-ghost btn-sm">
                  채팅
                </RouterLink>
              </div>
              <div class="rc-actions" v-else-if="r.status === 'PENDING'">
                <button class="btn btn-primary btn-sm" @click="updateStatus(r.id, 'CONFIRMED')">
                  ✓ 승인
                </button>
                <button class="btn btn-ghost btn-sm danger" @click="updateStatus(r.id, 'CANCELLED')">
                  ✕ 거절
                </button>
              </div>
            </div>
          </div>

          <!-- Memo -->
          <div v-if="r.requestMemo" class="rc-memo">
            💬 {{ r.requestMemo }}
          </div>
        </div>

        <div v-if="filteredReservations.length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <p class="empty-text">{{ activeTab === 'all' ? '예약 내역이 없습니다' : '해당 상태의 예약이 없습니다' }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { reservationApi } from '@/api/reservation'

const loading = ref(false)
const reservations = ref([])
const activeTab = ref('all')

const tabs = [
  { label: '전체', value: 'all' },
  { label: '대기중', value: 'PENDING' },
  { label: '확정', value: 'CONFIRMED' },
  { label: '완료', value: 'DONE' },
  { label: '취소', value: 'CANCELLED' },
]

const filteredReservations = computed(() => {
  if (activeTab.value === 'all') return reservations.value
  return reservations.value.filter(r => r.status === activeTab.value)
})

function countByStatus(status) {
  if (status === 'all') return null
  const cnt = reservations.value.filter(r => r.status === status).length
  return cnt > 0 ? cnt : null
}

function statusLabel(s) {
  return { PENDING: '대기중', CONFIRMED: '예약확정', DONE: '완료', CANCELLED: '취소됨' }[s] || s
}
function statusBadge(s) {
  return { PENDING: 'badge-gold', CONFIRMED: 'badge-green', DONE: 'badge-gray', CANCELLED: 'badge-red' }[s] || ''
}
function formatDate(str) {
  if (!str) return ''
  const d = new Date(str)
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} · ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

async function loadReservations() {
  loading.value = true
  try {
    const res = await reservationApi.getStylistReservations()
    reservations.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function updateStatus(id, status) {
  const msgMap = { CONFIRMED: '승인', CANCELLED: '거절', DONE: '완료 처리' }
  if (!confirm(`예약을 ${msgMap[status]}하시겠습니까?`)) return
  try {
    await reservationApi.updateStatus(id, status)
    await loadReservations()
  } catch (e) {
    alert(e.response?.data?.message || '상태 변경 중 오류가 발생했습니다.')
  }
}

onMounted(() => loadReservations())
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 16px;
}

.tab-bar { display: flex; gap: 4px; margin-bottom: 20px; border-bottom: 1px solid var(--color-border); flex-wrap: wrap; }
.tab-btn {
  padding: 10px 18px; background: none; border: none;
  font-size: 14px; font-weight: 500; color: var(--color-text-muted);
  cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px;
  transition: var(--transition); display: flex; align-items: center; gap: 6px;
}
.tab-btn:hover { color: var(--color-text-primary); }
.tab-btn.active { color: var(--color-gold); border-bottom-color: var(--color-gold); }
.tab-count {
  background: var(--color-gold); color: #1a1206;
  font-size: 11px; font-weight: 700;
  padding: 2px 6px; border-radius: var(--radius-full);
  min-width: 18px; text-align: center;
}

.reservation-list { display: flex; flex-direction: column; gap: 16px; }
.reservation-card { padding: 20px; }
.rc-main { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.rc-left { flex: 1; }
.rc-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.rc-id { font-size: 12px; color: var(--color-text-muted); }
.rc-service { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
.rc-date { font-size: 13px; color: var(--color-text-secondary); margin-bottom: 4px; }
.rc-price { font-size: 14px; font-weight: 600; color: var(--color-gold); }

.rc-right { display: flex; align-items: center; }
.rc-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.danger { color: var(--color-danger) !important; border-color: var(--color-danger) !important; }

.rc-memo {
  margin-top: 14px;
  padding: 10px 14px;
  background: var(--color-bg-surface);
  border-radius: var(--radius-md);
  font-size: 13px;
  color: var(--color-text-secondary);
  border-left: 3px solid var(--color-gold);
}

.empty-state { text-align: center; padding: 60px 0; }
.empty-icon { font-size: 40px; margin-bottom: 12px; }
.empty-text { color: var(--color-text-secondary); }

@media (max-width: 768px) {
  .page-header { flex-direction: column; }
  .rc-main { flex-direction: column; }
  .rc-actions { flex-wrap: wrap; }
}
</style>
