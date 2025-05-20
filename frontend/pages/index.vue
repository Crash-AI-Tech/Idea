<template>
  <div>
    <section class="idea-form-section">
      <h2>✨ {{ $t("ideas.addNew") }}</h2>
      <form @submit.prevent="logActionViaFunction" class="idea-form">
        <div class="form-group">
          <label for="titleInput">{{ $t("ideas.title") }}</label>
          <input
            id="titleInput"
            v-model="titleInput"
            type="text"
            :placeholder="$t('ideas.titlePlaceholder')"
            required
          />
        </div>
        <div class="form-group">
          <label for="contentInput">{{ $t("labels.ideaDescription") }}</label>
          <textarea
            id="contentInput"
            v-model="contentInput"
            :placeholder="$t('ideas.descriptionPlaceholder')"
            rows="5"
            required
          ></textarea>
        </div>
        <button type="submit" :disabled="loading" class="submit-button">
          {{ loading ? $t("ideas.submitting") : $t("ideas.submit") }}
        </button>
        <p v-if="message" :class="['message', messageType]" role="alert">
          {{ message }}
        </p>
      </form>
    </section>

    <section class="ideas-display-section">
      <h2>{{ $t("ideas.recentIdeas") }}</h2>
      <div v-if="loading && actions.length === 0" class="loading-state">
        <p>{{ $t("ideas.loading") }}</p>
      </div>
      <div v-else-if="actions.length > 0" class="ideas-grid">
        <div 
          class="idea-card" 
          v-for="action in actions" 
          :key="action.id"
          @click="navigateToIdea(action.id)"
        >
          <h3>{{ action.title }}</h3>
          <p class="idea-content">{{ action.content }}</p>
          <p class="idea-meta">
            记录于: {{ new Date(action.created_at).toLocaleDateString() }}
            {{ new Date(action.created_at).toLocaleTimeString() }}
          </p>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>{{ $t("ideas.empty") }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const runtimeConfig = useRuntimeConfig();
const router = useRouter();

const titleInput = ref("");
const contentInput = ref("");
const loading = ref(false);
const message = ref("");
const messageType = ref(""); // 'success' or 'error'
const actions = ref([]);

const FIXED_USER_ID = "10001234"; // 保持固定的用户ID
const functionUrl = `${runtimeConfig.public.supabase.url}/functions/v1/contents`;

// 获取点子列表
const fetchActions = async () => {
  loading.value = true;
  const { data, error } = await supabase
    .from("contents")
    .select("id, title, content, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("获取内容记录失败:", error);
    actions.value = [];
    message.value = "获取点子列表失败: " + error.message;
    messageType.value = "error";
  } else {
    actions.value = data;
  }
  loading.value = false;
};

// 提交新点子
const logActionViaFunction = async () => {
  if (!titleInput.value.trim() || !contentInput.value.trim()) {
    message.value = "标题和内容都不能为空！";
    messageType.value = "error";
    return;
  }
  loading.value = true;
  message.value = "";

  try {
    const response = await $fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: FIXED_USER_ID,
        title: titleInput.value.trim(),
        content: contentInput.value.trim(),
      }),
    });

    message.value = response.message || "点子已成功记录！ 🎉";
    messageType.value = "success";
    titleInput.value = "";
    contentInput.value = "";
    await fetchActions();
  } catch (e) {
    console.error("调用函数失败:", e);
    message.value = e.data?.error || e.message || "记录点子失败，请稍后重试。";
    messageType.value = "error";
  } finally {
    loading.value = false;
  }
};

// 跳转到点子详情页
const navigateToIdea = (ideaId) => {
  router.push(`/ideas/${ideaId}`);
};

onMounted(() => {
  fetchActions();
});
</script>

<style scoped>
/* 从 app.vue 中复制相关样式 */
.idea-form-section,
.ideas-display-section {
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

.loading-state,
.empty-state {
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.idea-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
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
  flex-grow: 1;
  white-space: pre-wrap;
}

.idea-card .idea-meta {
  font-size: 0.8rem;
  color: var(--secondary-color);
  text-align: right;
  margin-top: auto;
}

/* 响应式 */
@media (max-width: 768px) {
  .idea-form-section,
  .ideas-display-section {
    padding: 1.5rem;
  }
  h2 {
    font-size: 1.5rem;
  }
  .ideas-grid {
    grid-template-columns: 1fr;
  }
}
</style>