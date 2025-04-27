<template>
  <div class="min-h-screen flex items-center justify-center bg-dark-bg">
    <div class="bg-dark-card p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-light-text">登录</h2>

      <!-- GitHub Login -->
      <button 
        @click="loginWithGithub"
        class="w-full bg-gray-700 hover:bg-gray-600 text-light-text font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4 transition duration-200 ease-in-out flex items-center justify-center"
      >
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.379.201 2.397.098 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" /></svg>
        使用 GitHub 登录
      </button>

      <div class="relative flex py-5 items-center">
        <div class="flex-grow border-t border-gray-600"></div>
        <span class="flex-shrink mx-4 text-medium-text">或</span>
        <div class="flex-grow border-t border-gray-600"></div>
      </div>

      <!-- Email/Password Login -->
      <form @submit.prevent="loginWithEmail">
        <div class="mb-4">
          <label for="email" class="block text-medium-text text-sm font-bold mb-2">邮箱:</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            class="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-dark-bg text-light-text leading-tight focus:outline-none focus:shadow-outline focus:border-primary-green"
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-medium-text text-sm font-bold mb-2">密码:</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            class="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-dark-bg text-light-text leading-tight focus:outline-none focus:shadow-outline focus:border-primary-green"
          />
        </div>
        <button 
          type="submit"
          class="w-full bg-primary-green hover:bg-green-600 text-dark-bg font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
        >
          使用邮箱登录
        </button>
      </form>

      <p v-if="errorMsg" class="text-red-500 text-xs italic mt-4 text-center">错误: {{ errorMsg }}</p>

      <p class="mt-6 text-center text-medium-text text-sm">
        还没有账户? 
        <NuxtLink to="/register" class="font-bold text-primary-green hover:text-green-400">点此注册</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const client = useSupabaseClient()
const errorMsg = ref<string | null>(null)
const email = ref('')
const password = ref('')

// GitHub Login Logic
const loginWithGithub = async () => {
  errorMsg.value = null
  const { error } = await client.auth.signInWithOAuth({
    provider: 'github',
    options: {
        redirectTo: `${window.location.origin}/confirm`
    }
  })
  if (error) {
    console.error('GitHub login error:', error)
    errorMsg.value = error.message
  }
}

// Email/Password Login Logic
const loginWithEmail = async () => {
  errorMsg.value = null
  try {
    const { error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (error) throw error
    console.log('Email login successful!')
    // Redirect after successful login
    const router = useRouter()
    router.push('/') // Redirect to home page for example
  } catch (error: any) {
    console.error('Email login error:', error)
    errorMsg.value = error.message || '登录时发生错误'
  }
}

</script>