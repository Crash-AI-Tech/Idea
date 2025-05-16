// frontend/app.vue
<template>
  <div class="container">
    <h1>创意点子记录器</h1>
    <div class="input-area">
      <input 
        v-model="titleInput" 
        type="text" 
        placeholder="输入点子标题..."
      />
      <input 
        v-model="contentInput" 
        type="text" 
        placeholder="输入点子描述..."
      />
      <button @click="logActionViaFunction" :disabled="loading">
        {{ loading ? '发送中...' : '发送' }}
      </button>
    </div>
    <p v-if="message" :class="messageType">{{ message }}</p>

    <h2>已记录的行为 (最近5条)</h2>
    <ul v-if="actions.length > 0">
      <li v-for="action in actions" :key="action.id">
        [{{ new Date(action.created_at).toLocaleString() }}] 用户 {{ action.user_id }}: {{ action.content }}
      </li>
    </ul>
    <p v-else>暂无记录。</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 获取Supabase客户端实例 (仍然用于获取数据)
const supabase = useSupabaseClient()
// 获取Nuxt运行时配置 (用于获取Supabase URL)
const runtimeConfig = useRuntimeConfig()

// 响应式变量
const titleInput = ref('')
const contentInput = ref('')
const loading = ref(false)
const message = ref('')
const messageType = ref('') // 'success' or 'error'
const actions = ref([])

// 固定的用户ID
const FIXED_USER_ID = '10001234'

// Edge Function 的 URL
// 你可以从 Supabase CLI 部署成功后的输出中获取，或者在 Supabase Dashboard -> Edge Functions 中找到
// 确保替换 <YOUR_PROJECT_REF> 为你的项目引用ID
const functionUrl = `${runtimeConfig.public.supabase.url}/functions/v1/contents`


// 获取最近的内容记录 (这部分仍然可以直接从前端查询，因为只是读取)
const fetchActions = async () => {
  const { data, error } = await supabase
    .from('contents')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('获取内容记录失败:', error)
    actions.value = []
  } else {
    actions.value = data
  }
}

// 组件挂载时获取一次记录
onMounted(() => {
  fetchActions()
})

// 通过调用 Edge Function 发送行为记录
const logActionViaFunction = async () => {
  if (!titleInput.value.trim()) {
    message.value = '标题描述不能为空！'
    messageType.value = 'error'
    return
  }
if (!contentInput.value.trim()) {
    message.value = '内容描述不能为空！'
    messageType.value = 'error'
    return
  }
  loading.value = true
  message.value = ''

  try {
    // 使用 $fetch (Nuxt 提供的全局 fetch) 调用 Edge Function
    const response = await $fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 如果你的函数需要 anon key (虽然我们这个例子中服务角色密钥在后端使用)
        // 'apikey': runtimeConfig.public.supabase.key 
      },
      body: JSON.stringify({
        userId: FIXED_USER_ID,
        title: titleInput.value.trim(),
        content: contentInput.value.trim(),
      })
    })

    console.log('函数响应:', response)
    message.value = response.message || '行为已成功记录！'
    messageType.value = 'success'
    titleInput.value = ''
    contentInput.value = ''

    await fetchActions() // 重新获取记录

  } catch (e) {
    console.error('调用函数失败:', e)
    // e.data 通常包含来自函数的错误响应体
    message.value = e.data?.error || e.message || '调用函数失败，请查看控制台。'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 样式保持不变 */
.container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  font-family: sans-serif;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  color: #333;
}

.input-area {
  display: flex;
  margin-bottom: 20px;
}

input[type="text"] {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
}

button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background-color: #aaa;
}

p {
  text-align: center;
  margin-bottom: 20px;
}

.success {
  color: green;
}

.error {
  color: red;
}

h2 {
  margin-top: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  color: #555;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #f9f9f9;
  padding: 8px;
  margin-bottom: 5px;
  border-radius: 4px;
  font-size: 0.9em;
  color: #333;
}
</style>