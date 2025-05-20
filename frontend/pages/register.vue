<template>
  <div>
    <section class="auth-section">
      <h2>{{ $t("buttons.register") }}</h2>
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="email">{{ $t("labels.email") }}</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="your.email@example.com"
          />
        </div>
        <div class="form-group">
          <label for="password">{{ $t("labels.password") }}</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="********"
            minlength="6"
          />
        </div>
        <button type="submit" :disabled="loading" class="submit-button">
          {{ loading ? $t("auth.registering") : $t("buttons.register") }}
        </button>
        <p v-if="error" class="message error" role="alert">
          {{ error }}
        </p>
        <p v-if="success" class="message success" role="alert">
          {{ success }}
        </p>
      </form>
      <div class="auth-links">
        <p>
          {{ $t("auth.alreadyHaveAccount") }}
          <NuxtLink to="/login">{{ $t("auth.loginHere") }}</NuxtLink>
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");

const handleRegister = async () => {
  loading.value = true;
  error.value = "";
  success.value = "";
  
  try {
    const { error: err } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });
    
    if (err) throw err;
    
    success.value = "注册成功！请查看您的邮箱以验证账户。";
    
    // 注册成功后可以选择自动登录并跳转，或者等待邮箱验证
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  } catch (err) {
    console.error("注册失败:", err);
    error.value = err.message || "注册失败，请稍后重试";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 与 login.vue 使用相同的样式 */
.auth-section {
  background-color: var(--card-background-color);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  max-width: 500px;
  margin: 0 auto;
}

h2 {
  font-size: 1.75rem;
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
}

.auth-form .form-group {
  margin-bottom: 1.5rem;
}

.auth-form label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--secondary-color);
}

.auth-form input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.auth-form input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: var(--input-focus-shadow);
}

.submit-button {
  width: 100%;
  background-color: var(--primary-color);
  color: var(--light-text-color);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
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

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.auth-links {
  margin-top: 1.5rem;
  text-align: center;
}

.auth-links a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.auth-links a:hover {
  text-decoration: underline;
}
</style>