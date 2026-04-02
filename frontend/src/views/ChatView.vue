<template>
  <main class="chat-page">
    <div class="chat-layout">
      <!-- Header -->
      <div class="chat-header">
        <button class="back-btn" @click="$router.back()">←</button>
        <img src="https://i.pravatar.cc/50?img=47" class="ch-avatar" />
        <div class="ch-info">
          <p class="ch-name">김다은</p>
          <p class="ch-status">D.E Studio · 온라인</p>
        </div>
        <div class="ch-badge badge badge-green">예약확정</div>
      </div>

      <!-- Reservation Info Banner -->
      <div class="res-banner">
        📅 2026.03.15 (일) · 14:00 · 염색 (Color)
      </div>

      <!-- Messages -->
      <div class="messages-area" ref="msgArea">
        <div class="day-divider">오늘</div>

        <div
          v-for="msg in messages"
          :key="msg.id"
          class="msg-row"
          :class="{ mine: msg.mine }"
        >
          <img v-if="!msg.mine" src="https://i.pravatar.cc/36?img=47" class="msg-avatar" />
          <div class="msg-bubble-wrap">
            <div class="msg-bubble" :class="{ mine: msg.mine }">
              <img v-if="msg.image" :src="msg.image" class="msg-image" />
              <p v-else>{{ msg.text }}</p>
            </div>
            <span class="msg-time">{{ msg.time }}</span>
          </div>
        </div>

        <!-- Typing indicator -->
        <div v-if="isTyping" class="msg-row">
          <img src="https://i.pravatar.cc/36?img=47" class="msg-avatar" />
          <div class="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-input-area">
        <button class="icon-btn" @click="$refs.imgInput.click()" title="사진 전송">📷</button>
        <input ref="imgInput" type="file" accept="image/*" style="display:none" @change="sendImage" />
        <input
          v-model="inputText"
          class="chat-input"
          placeholder="메시지를 입력하세요..."
          @keyup.enter="sendMessage"
        />
        <button class="send-btn" :disabled="!inputText.trim()" @click="sendMessage">
          전송
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'

const msgArea = ref(null)
const inputText = ref('')
const isTyping = ref(false)

const messages = ref([
  { id: 1, text: '안녕하세요! 예약해 주셔서 감사합니다 😊', time: '14:02', mine: false },
  { id: 2, text: '안녕하세요! 잘 부탁드립니다.', time: '14:03', mine: true },
  { id: 3, text: '원하시는 스타일 사진이 있으시면 미리 보내주셔도 좋아요!', time: '14:04', mine: false },
  { id: 4, text: '네! 참고 사진 올려드릴게요', time: '14:05', mine: true },
  { id: 5, image: 'https://picsum.photos/seed/hair1/200/200', time: '14:05', mine: true },
  { id: 6, text: '오, 너무 예쁜 스타일이네요! 충분히 가능합니다 ✂️', time: '14:06', mine: false },
])

async function sendMessage() {
  if (!inputText.value.trim()) return
  messages.value.push({ id: Date.now(), text: inputText.value, time: '방금', mine: true })
  inputText.value = ''
  await scrollToBottom()

  // 타이핑 시뮬레이션 (실제로는 WS로 수신)
  isTyping.value = true
  await scrollToBottom()
  setTimeout(async () => {
    isTyping.value = false
    messages.value.push({ id: Date.now() + 1, text: '네, 알겠습니다!', time: '방금', mine: false })
    await scrollToBottom()
  }, 1500)
}

function sendImage(e) {
  const file = e.target.files[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  messages.value.push({ id: Date.now(), image: url, time: '방금', mine: true })
  scrollToBottom()
}

async function scrollToBottom() {
  await nextTick()
  if (msgArea.value) msgArea.value.scrollTop = msgArea.value.scrollHeight
}

onMounted(() => scrollToBottom())
</script>

<style scoped>
.chat-page { height: calc(100vh - 68px); display: flex; flex-direction: column; }
.chat-layout { display: flex; flex-direction: column; height: 100%; max-width: 720px; margin: 0 auto; width: 100%; }

.chat-header {
  display: flex; align-items: center; gap: 12px;
  padding: 16px 20px;
  background: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}
.back-btn { background: none; border: none; font-size: 20px; color: var(--color-text-secondary); cursor: pointer; padding: 4px; }
.back-btn:hover { color: var(--color-text-primary); }
.ch-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
.ch-info { flex: 1; }
.ch-name { font-size: 15px; font-weight: 600; }
.ch-status { font-size: 12px; color: var(--color-success); }
.ch-badge { margin-left: auto; }

.res-banner {
  background: rgba(201,169,110,0.08);
  border-bottom: 1px solid rgba(201,169,110,0.15);
  padding: 10px 20px;
  font-size: 13px;
  color: var(--color-gold);
  flex-shrink: 0;
}

.messages-area {
  flex: 1; overflow-y: auto;
  padding: 20px;
  display: flex; flex-direction: column; gap: 12px;
}

.day-divider {
  text-align: center; font-size: 12px; color: var(--color-text-muted);
  margin: 8px 0;
}

.msg-row { display: flex; align-items: flex-end; gap: 8px; }
.msg-row.mine { flex-direction: row-reverse; }

.msg-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }

.msg-bubble-wrap { display: flex; flex-direction: column; gap: 4px; max-width: 65%; }
.msg-row.mine .msg-bubble-wrap { align-items: flex-end; }

.msg-bubble {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px 16px 16px 4px;
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.6;
}
.msg-bubble.mine {
  background: var(--color-gold);
  color: #ffffff;
  border-color: transparent;
  border-radius: 16px 16px 4px 16px;
}
.msg-image { width: 180px; height: 180px; object-fit: cover; border-radius: 12px; display: block; }
.msg-time { font-size: 11px; color: var(--color-text-muted); }

/* Typing indicator */
.typing-indicator {
  background: var(--color-bg-card); border: 1px solid var(--color-border);
  border-radius: 16px 16px 16px 4px; padding: 12px 16px;
  display: flex; gap: 4px; align-items: center;
}
.typing-indicator span {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--color-text-muted);
  animation: bounce 1.2s infinite;
}
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }

/* Input */
.chat-input-area {
  display: flex; gap: 8px; align-items: center;
  padding: 12px 16px;
  background: var(--color-bg-surface);
  border-top: 1px solid var(--color-border);
  flex-shrink: 0;
}
.icon-btn { background: none; border: 1px solid var(--color-border); border-radius: var(--radius-sm); width: 40px; height: 40px; font-size: 18px; cursor: pointer; transition: var(--transition); flex-shrink: 0; }
.icon-btn:hover { border-color: var(--color-gold); }
.chat-input {
  flex: 1; background: var(--color-bg-card); border: 1.5px solid var(--color-border);
  border-radius: var(--radius-full); padding: 10px 18px;
  color: var(--color-text-primary); font-size: 14px; transition: var(--transition);
}
.chat-input:focus { border-color: var(--color-gold); }
.chat-input::placeholder { color: var(--color-text-muted); }
.send-btn {
  padding: 10px 20px; border-radius: var(--radius-full);
  background: var(--color-gold);
  color: #ffffff; font-weight: 600; font-size: 14px;
  transition: var(--transition); flex-shrink: 0;
}
.send-btn:hover:not(:disabled) { box-shadow: var(--shadow-gold); }
.send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
