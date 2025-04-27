<template>
  <div>
    <h2>注册新用户</h2>
    <form @submit.prevent="registerUser">
      <div>
        <label for="email">邮箱:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">密码:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <!-- Optional: Add password confirmation field -->
      <!--
      <div>
        <label for="passwordConfirm">确认密码:</label>
        <input type="password" id="passwordConfirm" v-model="passwordConfirm" required />
      </div>
      -->
      <button type="submit">注册</button>
    </form>
    <p v-if="errorMsg">错误: {{ errorMsg }}</p>
    <p v-if="successMsg">{{ successMsg }}</p>
    <p>已有账户? <NuxtLink to="/login">点此登录</NuxtLink></p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const client = useSupabaseClient()
const router = useRouter()
const email = ref('')
const password = ref('')
// const passwordConfirm = ref('') // Uncomment if using confirmation
const errorMsg = ref<string | null>(null)
const successMsg = ref<string | null>(null)

const registerUser = async () => {
  errorMsg.value = null
  successMsg.value = null

  // Optional: Add password confirmation check
  // if (password.value !== passwordConfirm.value) {
  //   errorMsg.value = 'Passwords do not match'
  //   return
  // }

  try {
    const { data, error } = await client.auth.signUp({
      email: email.value,
      password: password.value,
      // You can add options here, like redirect URL after email confirmation
      // options: {
      //   emailRedirectTo: `${window.location.origin}/confirm`
      // }
    })

    if (error) throw error

    // Check if email confirmation is required (default Supabase setting)
    if (data.user && data.user.identities && data.user.identities.length === 0) {
        successMsg.value = '注册成功！请检查您的邮箱以完成验证。'
        // Optionally clear the form
        email.value = ''
        password.value = ''
        // passwordConfirm.value = '' // Uncomment if using confirmation
    } else if (data.user) {
        successMsg.value = '注册成功！您现在可以登录了。'
        // Optionally redirect to login or clear form
        email.value = ''
        password.value = ''
        // passwordConfirm.value = '' // Uncomment if using confirmation
        // Consider redirecting after a short delay
        // setTimeout(() => router.push('/login'), 2000)
    } else {
        // Handle unexpected cases where user is null but no error
        errorMsg.value = '注册过程中发生未知错误。'
    }

  } catch (error: any) {
    console.error('Registration error:', error)
    errorMsg.value = error.message || '注册时发生错误'
  }
}
</script>
