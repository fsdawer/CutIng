<template>
  <RouterLink :to="`/stylist/${stylist.id}`" class="stylist-card">
    <!-- Cover -->
    <div class="card-cover">
      <img
        :src="stylist.profileImg || `https://i.pravatar.cc/200?u=${stylist.id}`"
        :alt="stylist.name"
        class="card-avatar"
      />
      <div class="card-rating">
        <span class="star">★</span>
        <span>{{ stylist.rating?.toFixed(1) ?? '새로운' }}</span>
      </div>
    </div>

    <!-- Info -->
    <div class="card-body">
      <div class="card-top">
        <div>
          <h3 class="card-name">{{ stylist.name }}</h3>
          <p class="card-salon">{{ stylist.salonName }}</p>
        </div>
        <span class="card-exp">경력 {{ stylist.experience }}년</span>
      </div>

      <p class="card-location">📍 {{ stylist.location }}</p>

      <div class="card-footer">
        <span class="review-count">리뷰 {{ stylist.reviewCount ?? 0 }}개</span>
        <span class="book-btn">예약하기 →</span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
defineProps({ stylist: Object })
</script>

<style scoped>
.stylist-card {
  display: block;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: var(--transition);
  box-shadow: var(--shadow-card);
}
.stylist-card:hover {
  border-color: rgba(201,169,110,0.4);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.card-cover {
  position: relative;
  height: 140px;
  display: flex;
  align-items: flex-end;
  padding: 0 20px 0;
  background: var(--color-bg-surface);
}
.card-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-bg-card);
  translate: 0 36px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.5);
}
.card-rating {
  position: absolute;
  top: 12px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: #ffffff;
  border-radius: var(--radius-full);
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  color: #1a1a1a;
}
.star { color: var(--color-gold); }

.card-body {
  padding: 48px 20px 20px;
}
.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 10px;
}
.card-name {
  font-size: 17px;
  font-weight: 700;
}
.card-salon {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 2px;
}
.card-exp {
  font-size: 12px;
  color: var(--color-text-muted);
  background: var(--color-bg-surface);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
}

.card-location {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}
.review-count {
  font-size: 12px;
  color: var(--color-text-muted);
}
.book-btn {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-gold);
}
</style>
