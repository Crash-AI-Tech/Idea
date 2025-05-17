// frontend/app.vue
<template>
  <div id="app-container">
    <header class="app-header">
      <h1>💡 创意点子记录器</h1>
    </header>

    <main class="app-main">
      <section class="idea-form-section">
        <h2>✨ 添加新点子</h2>
        <form @submit.prevent="logActionViaFunction" class="idea-form">
          <div class="form-group">
            <label for="titleInput">点子标题</label>
            <input
              id="titleInput"
              v-model="titleInput"
              type="text"
              placeholder="给你的点子起个响亮的标题"
              required
            />
          </div>
          <div class="form-group">
            <label for="contentInput">详细内容</label>
            <textarea
              id="contentInput"
              v-model="contentInput"
              placeholder="详细描述你的创意点子..."
              rows="5"
              required
            ></textarea>
          </div>
          <button type="submit" :disabled="loading" class="submit-button">
            {{ loading ? '记录中...' : '🚀 记录点子' }}
          </button>
          <p v-if="message" :class="['message', messageType]" role="alert">
            {{ message }}
          </p>
        </form>
      </section>

      <section class="ideas-display-section">
        <h2>📋 最近的点子</h2>
        <div v-if="loading && actions.length === 0" class="loading-state">
          <p>正在加载点子...</p>
        </div>
        <div v-else-if="actions.length > 0" class="ideas-grid">
          <div class="idea-card" v-for="action in actions" :key="action.id">
            <h3>{{ action.title }}</h3>
            <p class="idea-content">{{ action.content }}</p>
            <p class="idea-meta">
              记录于: {{ new Date(action.created_at).toLocaleDateString() }} {{ new Date(action.created_at).toLocaleTimeString() }}
            </p>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>还没有点子，快去添加一个吧！</p>
        </div>
      </section>
    </main>

    <footer class="app-footer">
      <p>&copy; {{ new Date().getFullYear() }} 创意点子记录器. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const supabase = useSupabaseClient()
const runtimeConfig = useRuntimeConfig()

const titleInput = ref('')
const contentInput = ref('')
const loading = ref(false)
const message = ref('')
const messageType = ref('') // 'success' or 'error'
const actions = ref([])

const FIXED_USER_ID = '10001234' // 保持固定的用户ID
const functionUrl = `${runtimeConfig.public.supabase.url}/functions/v1/contents`

const fetchActions = async () => {
  loading.value = true; // 开始加载时设置
  const { data, error } = await supabase
    .from('contents')
    .select('id, title, content, created_at') // 明确选择所需字段
    .order('created_at', { ascending: false })
    .limit(10) // 显示更多点子

  if (error) {
    console.error('获取内容记录失败:', error)
    actions.value = []
    message.value = '获取点子列表失败: ' + error.message;
    messageType.value = 'error';
  } else {
    actions.value = data
  }
  loading.value = false; // 加载结束时设置
}

onMounted(() => {
  fetchActions()
})

const logActionViaFunction = async () => {
  if (!titleInput.value.trim() || !contentInput.value.trim()) {
    message.value = '标题和内容都不能为空！'
    messageType.value = 'error'
    return
  }
  loading.value = true
  message.value = ''

  try {
    const response = await $fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'apikey': runtimeConfig.public.supabase.key // 如果函数需要
      },
      body: JSON.stringify({
        userId: FIXED_USER_ID,
        title: titleInput.value.trim(),
        content: contentInput.value.trim(),
      })
    })

    message.value = response.message || '点子已成功记录！ 🎉'
    messageType.value = 'success'
    titleInput.value = ''
    contentInput.value = ''
    await fetchActions()
  } catch (e) {
    console.error('调用函数失败:', e)
    message.value = e.data?.error || e.message || '记录点子失败，请稍后重试。'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:root {
  --primary-color: #007bff; /* 科技蓝 */
  --primary-hover-color: #0056b3;
  --secondary-color: #6c757d; /* 中性灰 */
  --background-color: #f8f9fa; /* 淡雅背景 */
  --card-background-color: #ffffff; /* 卡片背景 */
  --text-color: #343a40; /* 深灰文字 */
  --light-text-color: #ffffff;
  --border-color: #dee2e6; /* 边框颜色 */
  --success-color: #28a745; /* 成功绿 */
  --error-color: #dc3545; /* 危险红 */
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --border-radius: 8px;
  --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  --input-focus-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: var(--font-family);
  line-height: 1.6;
}

.app-header {
  background-color: var(--primary-color);
  color: var(--light-text-color);
  padding: 1.5rem 2rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
}

.app-main {
  flex-grow: 1;
  padding: 2rem;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
}

.idea-form-section, .ideas-display-section {
  background-color: var(--card-background-color);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 2rem;
}

h2 {
  font-size: 1.75rem;
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--primary-color);
  display: inline-block;
}

.idea-form .form-group {
  margin-bottom: 1.5rem;
}

.idea-form label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--secondary-color);
}

.idea-form input[type="text"],
.idea-form textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.idea-form input[type="text"]:focus,
.idea-form textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: var(--input-focus-shadow);
}

.submit-button {
  background-color: var(--primary-color);
  color: var(--light-text-color);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--primary-hover-color);
}

.submit-button:disabled {
  background-color: var(--secondary-color);
  cursor: not-allowed;
  opacity: 0.7;
}

.message {
  padding: 0.75rem 1rem;
  margin-top: 1rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  text-align: center;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--secondary-color);
  font-size: 1.1rem;
}

.ideas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.idea-card {
  background-color: #fff;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}

.idea-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.1);
}

.idea-card h3 {
  font-size: 1.3rem;
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 0.75rem;
}

.idea-card .idea-content {
  font-size: 0.95rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  flex-grow: 1; /* Allows content to take up space */
  white-space: pre-wrap; /* Respects newlines in content */
}

.idea-card .idea-meta {
  font-size: 0.8rem;
  color: var(--secondary-color);
  text-align: right;
  margin-top: auto; /* Pushes meta to the bottom */
}

.app-footer {
  background-color: #343a40; /* Darker footer */
  color: #adb5bd; /* Lighter text for footer */
  text-align: center;
  padding: 1.5rem 2rem;
  margin-top: auto; /* Pushes footer to the bottom */
}

.app-footer p {
  margin: 0;
  font-size: 0.9rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .app-header h1 {
    font-size: 1.5rem;
  }
  .app-main {
    padding: 1rem;
  }
  .idea-form-section, .ideas-display-section {
    padding: 1.5rem;
  }
  h2 {
    font-size: 1.5rem;
  }
  .ideas-grid {
    grid-template-columns: 1fr; /* Stack cards on smaller screens */
  }
}
</style>