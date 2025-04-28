<template>
  <div class="min-h-screen flex items-center justify-center bg-dark-bg">
    <div class="bg-dark-card p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-light-text">{{ $t('auth.registerTitle') }}</h2>
      
      <form @submit.prevent="registerUser">
        <div class="mb-4">
          <label for="email" class="block text-medium-text text-sm font-bold mb-2">{{ $t('auth.email') }}:</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            class="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-dark-bg text-light-text leading-tight focus:outline-none focus:shadow-outline focus:border-primary-green"
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-medium-text text-sm font-bold mb-2">{{ $t('auth.password') }}:</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            class="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-dark-bg text-light-text leading-tight focus:outline-none focus:shadow-outline focus:border-primary-green"
          />
        </div>
        <div class="mb-6">
          <label for="passwordConfirm" class="block text-medium-text text-sm font-bold mb-2">{{ $t('auth.confirmPassword') }}:</label>
          <input 
            type="password" 
            id="passwordConfirm" 
            v-model="passwordConfirm" 
            required 
            class="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-dark-bg text-light-text leading-tight focus:outline-none focus:shadow-outline focus:border-primary-green"
          />
        </div>
        <button 
          type="submit"
          class="w-full bg-primary-green hover:bg-green-600 text-dark-bg font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
        >
          {{ $t('auth.registerButton') }}
        </button>
      </form>

      <p v-if="errorMsg" class="text-red-500 text-xs italic mt-4 text-center">{{ $t('common.error') }}: {{ errorMsg }}</p>
      <p v-if="successMsg" class="text-green-500 text-xs italic mt-4 text-center">{{ successMsg }}</p>

      <p class="mt-6 text-center text-medium-text text-sm">
        {{ $t('auth.loginPrompt') }} 
        <NuxtLink to="/login" class="font-bold text-primary-green hover:text-green-400">{{ $t('auth.loginLink') }}</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '#imports'

const { t } = useI18n()
const client = useSupabaseClient()
const router = useRouter()
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const errorMsg = ref<string | null>(null)
const successMsg = ref<string | null>(null)

const registerUser = async () => {
  errorMsg.value = null
  successMsg.value = null

  // Add password confirmation check
  if (password.value !== passwordConfirm.value) {
    errorMsg.value = t('auth.passwordMismatch')
    return
  }

  try {
    const { data, error } = await client.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: `${window.location.origin}/confirm`
      }
    })

    if (error) throw error

    // Check if email confirmation is required (default Supabase setting)
    if (data.user && data.user.identities && data.user.identities.length === 0) {
        successMsg.value = t('auth.registerSuccess')
        // Clear the form
        email.value = ''
        password.value = ''
        passwordConfirm.value = ''
    } else if (data.user) {
        successMsg.value = t('auth.registerSuccessNoConfirm')
        // Clear the form
        email.value = ''
        password.value = ''
        passwordConfirm.value = ''
        // Consider redirecting after a short delay
        setTimeout(() => router.push('/login'), 2000)
    } else {
        // Handle unexpected cases where user is null but no error
        errorMsg.value = t('auth.registerUnknownError')
    }

  } catch (error: any) {
    console.error('Registration error:', error)
    errorMsg.value = error.message || t('auth.registerError')
  }
}
</script>
