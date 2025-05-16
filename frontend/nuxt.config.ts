// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/supabase',
  ],
  supabase: {
    // URL 和 Key 会自动从 .env 文件读取
    // 我们这个简单项目不需要登录跳转，所以可以简化 redirectOptions
    redirectOptions: {
      login: '/login', // 虽然不用，但最好有个占位
      callback: '/confirm', // 同上
      exclude: ['/'], // 首页不需要认证
    }
  },
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true }
})
