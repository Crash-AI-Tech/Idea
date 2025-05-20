<template>
  <div>
    <section class="idea-detail-section">
      <div v-if="loading" class="loading-state">
        <p>{{ $t("ideas.loading") }}</p>
      </div>
      <div v-else-if="idea" class="idea-detail">
        <h1>{{ idea.title }}</h1>
        <div class="idea-meta">
          <span>{{ formatDate(idea.created_at) }}</span>
        </div>
        <div class="idea-content">
          {{ idea.content }}
        </div>
        <div class="actions">
          <button class="back-button" @click="goBack">
            ← {{ $t("buttons.back") }}
          </button>
        </div>
      </div>
      <div v-else class="error-state">
        <p>{{ error || "找不到该点子" }}</p>
        <button class="back-button" @click="goBack">
          ← {{ $t("buttons.back") }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const supabase = useSupabaseClient();

const ideaId = route.params.id;
const idea = ref(null);
const loading = ref(true);
const error = ref(null);

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 加载点子详情
const fetchIdea = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const { data, error: err } = await supabase
      .from("contents")
      .select("id, title, content, created_at")
      .eq("id", ideaId)
      .single();
      
    if (err) {
      throw err;
    }
    
    if (!data) {
      error.value = "找不到该点子";
      idea.value = null;
    } else {
      idea.value = data;
    }
  } catch (err) {
    console.error("获取点子详情失败:", err);
    error.value = "获取点子详情失败";
    idea.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchIdea();
});
</script>

<style scoped>
.idea-detail-section {
  background-color: var(--card-background-color);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.loading-state,
.error-state {
  text-align: center;
  padding: 2rem;
  color: var(--secondary-color);
  font-size: 1.1rem;
}

.error-state {
  color: var(--error-color);
}

.idea-detail h1 {
  font-size: 2rem;
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.idea-meta {
  color: var(--secondary-color);
  font-size: 0.9rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.idea-content {
  font-size: 1.1rem;
  line-height: 1.8;
  white-space: pre-wrap;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 2rem;
}

.back-button {
  background-color: var(--secondary-color);
  color: var(--light-text-color);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background-color: #5a6268;
}
</style>