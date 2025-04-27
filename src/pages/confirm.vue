<template>
  <div>正在处理登录...</div>
</template>

<script setup lang="ts">
// This page is the default callback route for Supabase OAuth
// It doesn't need much logic as the @nuxtjs/supabase module handles the session
// You might want to redirect the user after successful login

const user = useSupabaseUser()

watch(user, () => {
  if (user.value) {
    // Redirect to home or intended page after login
    navigateTo('/')
  }
}, { immediate: true })
</script>
