export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()

  if (!user.value) {
    // If user is not logged in, redirect to login page
    // You might want to store the intended route (to.fullPath) to redirect back after login
    return navigateTo('/login')
  }
})
