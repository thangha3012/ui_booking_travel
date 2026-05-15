<template>
  <!-- ============================================================
       TRAVEL CHATBOT — Floating AI Assistant
       Xuất hiện trên tất cả trang nhờ được mount trong App.vue
  ============================================================ -->
  <div class="chatbot-wrapper">
    <!-- Floating Trigger Button -->
    <Transition name="bounce">
      <button
        v-if="!isOpen"
        class="chatbot-trigger"
        @click="openChat"
        aria-label="Mở hỗ trợ du lịch"
      >
        <span class="trigger-avatar">
          <i class="pi pi-comments"></i>
        </span>
        <span class="trigger-badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
        <span class="trigger-pulse"></span>
      </button>
    </Transition>

    <!-- Chat Window -->
    <Transition name="chat-window">
      <div v-if="isOpen" class="chatbot-window" :class="{ minimized: isMinimized }">
        <!-- Header -->
        <div class="chatbot-header">
          <div class="header-info">
            <div class="bot-avatar">
              <i class="pi pi-map-marker"></i>
              <span class="online-dot"></span>
            </div>
            <div class="bot-meta">
              <div class="bot-name">Trợ lý Triptopia</div>
              <div class="bot-status">
                <span class="status-dot"></span>
                Đang trực tuyến
              </div>
            </div>
          </div>
          <div class="header-actions">
            <button class="icon-btn" @click="isMinimized = !isMinimized" :title="isMinimized ? 'Mở rộng' : 'Thu nhỏ'">
              <i :class="isMinimized ? 'pi pi-chevron-up' : 'pi pi-minus'"></i>
            </button>
            <button class="icon-btn close-btn" @click="closeChat" title="Đóng">
              <i class="pi pi-times"></i>
            </button>
          </div>
        </div>

        <!-- Body (ẩn khi minimize) -->
        <div v-show="!isMinimized" class="chatbot-body">
          <!-- Messages -->
          <div class="messages-container" ref="messagesContainer">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              class="message-row"
              :class="msg.role"
            >
              <!-- Bot avatar -->
              <div v-if="msg.role === 'bot'" class="msg-avatar">
                <i class="pi pi-map-marker"></i>
              </div>

              <!-- Bubble -->
              <div class="message-bubble" :class="msg.role">
                <div v-if="msg.type === 'text'" class="msg-text" v-html="msg.content"></div>

                <!-- Quick reply chips -->
                <div v-if="msg.chips && msg.chips.length" class="msg-chips">
                  <button
                    v-for="chip in msg.chips"
                    :key="chip"
                    class="chip-btn"
                    @click="sendChip(chip)"
                  >
                    {{ chip }}
                  </button>
                </div>

                <div class="msg-time">{{ msg.time }}</div>
              </div>
            </div>

            <!-- Typing indicator -->
            <div v-if="isTyping" class="message-row bot">
              <div class="msg-avatar"><i class="pi pi-map-marker"></i></div>
              <div class="message-bubble bot typing-bubble">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>

          <!-- Input Area -->
          <div class="chatbot-input">
            <div class="input-quick-actions" v-if="showQuickActions">
              <button
                v-for="qa in quickActions"
                :key="qa.label"
                class="quick-action-btn"
                @click="sendChip(qa.label)"
              >
                <i :class="qa.icon"></i>
                <span>{{ qa.label }}</span>
              </button>
            </div>

            <div class="input-row">
              <button class="input-icon-btn" @click="showQuickActions = !showQuickActions" title="Gợi ý nhanh">
                <i class="pi pi-bolt"></i>
              </button>
              <input
                ref="inputRef"
                v-model="userInput"
                type="text"
                placeholder="Nhập câu hỏi của bạn..."
                @keydown.enter="sendMessage"
                @keydown.enter.prevent
                :disabled="isTyping"
                class="chat-input"
              />
              <button
                class="send-btn"
                :disabled="!userInput.trim() || isTyping"
                @click="sendMessage"
              >
                <i class="pi pi-send"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import chatApi from '@/api/chatApi'

const messages = ref([])
const router = useRouter()
const route = useRoute()
const isOpen = ref(false)
const isMinimized = ref(false)
const isTyping = ref(false)
const userInput = ref('')
const unreadCount = ref(1)
const showQuickActions = ref(false)
const messagesContainer = ref(null)
const inputRef = ref(null)

const quickActions = [
  { label: 'Tour nổi bật', icon: 'pi pi-star' },
  { label: 'Giá vé', icon: 'pi pi-tag' },
  { label: 'Đặt tour', icon: 'pi pi-calendar' },
  { label: 'Liên hệ', icon: 'pi pi-phone' },
  { label: 'Chính sách hoàn tiền', icon: 'pi pi-shield' },
]

// Lưu lại token lúc khởi tạo để so sánh
const currentToken = ref(localStorage.getItem('auth_token'))

// Theo dõi sự thay đổi của Route (detect Login/Logout)
watch(() => route.path, () => {
  const newToken = localStorage.getItem('auth_token')
  if (newToken !== currentToken.value) {
    currentToken.value = newToken
    clearChat()
    initGreeting()
  }
})

// Hàm chuyển đổi Markdown cơ bản sang HTML
function formatMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '• $1')
    .replace(/\n/g, '<br>')
}

function getTime() {
  return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

function addBotMessage(content, chips = []) {
  messages.value.push({
    role: 'bot',
    type: 'text',
    content: formatMarkdown(content),
    chips,
    time: getTime()
  })
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function openChat() {
  isOpen.value = true
  isMinimized.value = false
  unreadCount.value = 0
  nextTick(() => inputRef.value?.focus())
}

function closeChat() {
  isOpen.value = false
}

async function processResponse(text) {
  isTyping.value = true
  try {
     const res = await chatApi.sendMessage(text)
     if (res && res.success) {
        addBotMessage(res.reply)
     } else {
        addBotMessage("Xin lỗi, mình đang gặp chút trục trặc. Bạn thử lại sau nhé! 🤖")
     }
  } catch(e) {
     console.error('Chat error:', e)
     addBotMessage("Oops! Có lỗi gì đó rồi, bạn thử lại sau nhé. 🙏")
  } finally {
     isTyping.value = false
  }
}

function sendMessage() {
  const text = userInput.value.trim()
  if (!text || isTyping.value) return

  messages.value.push({
    role: 'user',
    type: 'text',
    content: text,
    time: getTime()
  })

  userInput.value = ''
  showQuickActions.value = false
  scrollToBottom()
  processResponse(text)
}

function sendChip(chip) {
  if (isTyping.value) return
  userInput.value = chip
  sendMessage()
}

function clearChat() {
  messages.value = []
  unreadCount.value = 0
}

function initGreeting() {
  const userStr = localStorage.getItem('auth_user')
  let greetingName = ''
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      greetingName = user.fullName || user.email || ''
    } catch (e) { console.error(e) }
  }

  setTimeout(() => {
    if (messages.value.length === 0) {
      const welcomeText = greetingName 
        ? `👋 Xin chào <b>${greetingName}</b>! Mình là <b>Trợ lý Triptopia</b> — rất vui được gặp lại bạn! 🗺️`
        : '👋 Xin chào! Mình là <b>Trợ lý Triptopia</b> — sẵn sàng hỗ trợ bạn khám phá Việt Nam! 🗺️'
        
      addBotMessage(welcomeText, ['Tour nổi bật', 'Giá vé', 'Đặt tour', 'Liên hệ'])
    }
  }, 800)
}

onMounted(() => {
  initGreeting()
  window.addEventListener('storage', (e) => {
    if (e.key === 'auth_token') location.reload() 
  })
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

// =============================================
// CHATBOT WRAPPER
// =============================================
.chatbot-wrapper {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  font-family: $font-body;
}

// =============================================
// FLOATING TRIGGER BUTTON
// =============================================
.chatbot-trigger {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #235789 0%, #1E6B8C 50%, #FF6B35 100%);
  box-shadow: 0 8px 28px rgba(35, 87, 137, 0.45);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: $transition-base;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 12px 36px rgba(35, 87, 137, 0.55);
  }

  .trigger-avatar {
    color: #fff;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .trigger-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: $color-accent;
    color: #fff;
    font-size: 0.7rem;
    font-weight: $font-weight-bold;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #fff;
  }

  .trigger-pulse {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(35, 87, 137, 0.3);
    animation: pulse-ring 2.5s ease infinite;
  }
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.6); opacity: 0; }
}

// =============================================
// CHAT WINDOW
// =============================================
.chatbot-window {
  width: 370px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 24px 64px rgba(26, 32, 44, 0.18), 0 4px 16px rgba(35, 87, 137, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 580px;
  border: 1px solid $color-border-light;

  &.minimized {
    max-height: auto;
    .chatbot-body { display: none; }
  }
}

// =============================================
// HEADER
// =============================================
.chatbot-header {
  background: linear-gradient(135deg, $color-primary 0%, #1E6B8C 100%);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;

  .header-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .bot-avatar {
    position: relative;
    width: 42px;
    height: 42px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 1.2rem;
    backdrop-filter: blur(8px);
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .online-dot {
    position: absolute;
    bottom: 1px;
    right: 1px;
    width: 11px;
    height: 11px;
    background: #22c55e;
    border-radius: 50%;
    border: 2px solid #fff;
    animation: blink-dot 2s ease-in-out infinite;
  }

  .bot-name {
    color: #fff;
    font-weight: $font-weight-semibold;
    font-size: 0.95rem;
  }

  .bot-status {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .status-dot {
    width: 7px;
    height: 7px;
    background: #86efac;
    border-radius: 50%;
  }

  .header-actions {
    display: flex;
    gap: 4px;
  }

  .icon-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    transition: $transition-fast;
    backdrop-filter: blur(4px);

    &:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    &.close-btn:hover {
      background: rgba(239, 68, 68, 0.4);
    }
  }
}

@keyframes blink-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

// =============================================
// BODY
// =============================================
.chatbot-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

// =============================================
// MESSAGES
// =============================================
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 300px;
  max-height: 380px;
  scroll-behavior: smooth;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: $color-border; border-radius: 4px; }
}

.message-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;

  &.user {
    flex-direction: row-reverse;
  }

  .msg-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, $color-primary, #1E6B8C);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.8rem;
    flex-shrink: 0;
  }
}

.message-bubble {
  max-width: 78%;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 0.875rem;
  line-height: 1.55;
  position: relative;

  &.bot {
    background: $color-bg-surface;
    color: $color-text-primary;
    border-bottom-left-radius: 4px;
  }

  &.user {
    background: linear-gradient(135deg, $color-primary 0%, #1E6B8C 100%);
    color: #fff;
    border-bottom-right-radius: 4px;
  }

  .msg-text {
    word-break: break-word;
    br { display: block; content: ''; margin-bottom: 4px; }
  }

  .msg-time {
    font-size: 0.68rem;
    opacity: 0.55;
    margin-top: 5px;
    text-align: right;
  }
}

// Quick-reply chips inside bubble
.msg-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;

  .chip-btn {
    padding: 5px 12px;
    border-radius: 20px;
    border: 1.5px solid rgba(35, 87, 137, 0.3);
    background: #fff;
    color: $color-primary;
    font-size: 0.78rem;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: $transition-fast;
    white-space: nowrap;

    &:hover {
      background: $color-primary;
      color: #fff;
      border-color: $color-primary;
      transform: translateY(-1px);
    }
  }
}

// Typing indicator
.typing-bubble {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 12px 16px;

  span {
    width: 8px;
    height: 8px;
    background: $color-text-muted;
    border-radius: 50%;
    animation: typing-dot 1.4s infinite ease-in-out;

    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

@keyframes typing-dot {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-6px); opacity: 1; }
}

// =============================================
// INPUT AREA
// =============================================
.chatbot-input {
  border-top: 1px solid $color-border-light;
  padding: 12px 14px;
  background: #fff;
  flex-shrink: 0;
}

.input-quick-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 10px;

  .quick-action-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    border-radius: 16px;
    border: 1.5px solid $color-border;
    background: $color-bg-surface;
    color: $color-text-body;
    font-size: 0.75rem;
    cursor: pointer;
    transition: $transition-fast;

    i { font-size: 0.75rem; color: $color-primary; }

    &:hover {
      border-color: $color-primary;
      background: rgba(35, 87, 137, 0.06);
      color: $color-primary;
    }
  }
}

.input-row {
  display: flex;
  align-items: center;
  gap: 8px;

  .input-icon-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1.5px solid $color-border;
    background: $color-bg-surface;
    color: $color-primary;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    flex-shrink: 0;
    transition: $transition-fast;

    &:hover {
      background: rgba(35, 87, 137, 0.1);
      border-color: $color-primary;
    }
  }

  .chat-input {
    flex: 1;
    border: 1.5px solid $color-border;
    border-radius: 20px;
    padding: 9px 16px;
    font-size: 0.875rem;
    outline: none;
    color: $color-text-primary;
    background: $color-bg-surface;
    transition: $transition-fast;
    font-family: $font-body;

    &::placeholder { color: $color-text-muted; }

    &:focus {
      border-color: rgba(35, 87, 137, 0.5);
      background: #fff;
      box-shadow: 0 0 0 3px rgba(35, 87, 137, 0.08);
    }

    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }

  .send-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, $color-primary, #1E6B8C);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    flex-shrink: 0;
    transition: $transition-fast;

    &:hover:not(:disabled) {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(35, 87, 137, 0.4);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}

// =============================================
// TRANSITIONS
// =============================================
.bounce-enter-active { animation: bounce-in 0.5s ease; }
.bounce-leave-active { animation: bounce-in 0.3s ease reverse; }

@keyframes bounce-in {
  0% { transform: scale(0) rotate(-15deg); opacity: 0; }
  60% { transform: scale(1.12) rotate(3deg); }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}

.chat-window-enter-active {
  animation: window-slide-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.chat-window-leave-active {
  animation: window-slide-in 0.25s ease reverse;
}

@keyframes window-slide-in {
  0% { transform: translateY(20px) scale(0.9); opacity: 0; transform-origin: bottom right; }
  100% { transform: translateY(0) scale(1); opacity: 1; transform-origin: bottom right; }
}

// =============================================
// RESPONSIVE
// =============================================
@media (max-width: 480px) {
  .chatbot-wrapper {
    bottom: 16px;
    right: 16px;
  }

  .chatbot-window {
    width: calc(100vw - 32px);
    max-height: 70vh;
  }
}
</style>
