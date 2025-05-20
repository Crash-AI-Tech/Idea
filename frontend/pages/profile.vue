<template>
  <div>
    <section class="profile-section">
      <h2>{{ $t("menu.profile") }}</h2>
      
      <div v-if="loading" class="loading-state">
        <p>{{ $t("profile.loading") }}</p>
      </div>
      
      <div v-else-if="user" class="profile-content">
        <div class="user-info">
          <h3>{{ $t("profile.userInfo") }}</h3>
          <p><strong>{{ $t("labels.email") }}:</strong> {{ user.email }}</p>
        </div>
        
        <div class="user-ideas">
          <h3>{{ $t("profile.yourIdeas") }}</h3>
          <div v-if="userIdeas.length === 0" class="empty-state">
            <p>{{ $t("profile.noIdeas") }}</p>
          </div>
          <div v-else class="ideas-list">
            <div 
              v-for="idea in userIdeas" 
              :key="idea.id" 
              class="idea-item"
              @click="navigateToIdea(idea.id)"
            >
              <h4>{{ idea.title }}</h4>
              <p class="idea-date">{{ formatDate(idea.created_at) }}</p>
            </div>
          </div>
        </div>
        
        <div class="actions">
          <button class="logout-button" @click="handleLogout">
            {{ $t("buttons.logout") }}
          </button>
        </div>
      </div>
      
      <div v-else class="not-logged-in">
        <p>{{ $t("profile.notLoggedIn") }}</p>
        <div class="auth-links">
          <NuxtLink to="/login" class="login-link">
            {{ $t("buttons.login") }}
          </NuxtLink>
          <NuxtLink to="/register" class="register-link">
            {{ $t("buttons.register") }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const router = useRouter();

const user = ref(null);
const userIdeas = ref([]);
const loading = ref(true);

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

// 导航到点子详情
const navigateToIdea = (ideaId) => {
  router.push(`/ideas/${ideaId}`);
};

// 登出
const handleLogout = async () => {
  try {
    await supabase.auth.signOut();
    // 登出后跳转到首页
    router.push('/');
  } catch (error) {
    console.error('登出失败:', error);
  }
};

// 获取用户信息和他的点子
const fetchUserData = async () => {
  loading.value = true;
  
  try {
    // 获取当前登录用户
    const { data: { user: userData } } = await supabase.auth.getUser();
    user.value = userData;
    
    if (userData) {
      // 获取用户的点子
      const { data, error } = await supabase
        .from('contents')
        .select('id, title, created_at')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      userIdeas.value = data || [];
    }
  } catch (error) {
    console.error('获取用户数据失败:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUserData();
});
</script>

<style scoped>
.profile-section {
  background-color: var(--card-background-color);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
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

.loading-state,
.empty-state {
  text-align: center;
  padding: 1rem;
  color: var(--secondary-color);
  font-size: 1.1rem;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.user-info,
.user-ideas {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.user-info h3,
.user-ideas h3 {
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.ideas-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.idea-item {
  padding: 1rem;
  background-color: white;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.idea-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.idea-item h4 {
  margin: 0 0 0.5rem 0;
  color: var(--primary-color);
}

.idea-date {
  font-size: 0.8rem;
  color: var(--secondary-color);
  margin: 0;
}

.actions {
  margin-top: 1rem;
}

.logout-button {
  background-color: var(--error-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #c82333;
}

.not-logged-in {
  text-align: center;
  padding: 2rem;
}

.auth-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.login-link,
.register-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s;
}

.login-link {
  background-color: var(--primary-color);
  color: white;
}

.login-link:hover {
  background-color: var(--primary-hover-color);
}

.register-link {
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  background-color: transparent;
}

.register-link:hover {
  background-color: rgba(0, 123, 255, 0.1);
}
</style>