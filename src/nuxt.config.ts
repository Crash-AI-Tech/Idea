import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n' // 添加 i18n 模块
  ],
  supabase: {
    // Options
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: '/login',
      callback: '/confirm', // Default Supabase callback URL
      exclude: ['/login', '/register', '/confirm', '/'], // Routes that don't require auth
    }
  },
  typescript: {
    strict: true // Enable strict type checking
  },
  // i18n 配置
  i18n: {
    strategy: 'prefix_except_default', // 默认语言不带前缀，其他语言带前缀 (e.g., /en/about)
    locales: [
      {
        code: 'zh',
        iso: 'zh-CN',
        name: '中文',
        file: 'zh.json' // 指定语言文件
      },
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json'
      },
      {
        code: 'ar',
        iso: 'ar-SA',
        name: 'العربية',
        file: 'ar.json',
        dir: 'rtl' // 指定阿拉伯语为从右到左
      },
      {
        code: 'es',
        iso: 'es-ES',
        name: 'Español',
        file: 'es.json' // 添加西班牙语
      }
    ],
    lazy: true, // 懒加载语言文件
    langDir: 'i18n/locales/', // 修正为正确的相对路径
    defaultLocale: 'zh', // 设置默认语言为中文
    detectBrowserLanguage: { // 浏览器语言检测
      useCookie: true, // 使用 cookie 存储用户选择
      cookieKey: 'i18n_redirected', // cookie 名称
      redirectOn: 'root',  // 仅在根路径 / 时重定向
    },
    vueI18n: 'i18n.config.ts', // 使用相对路径
    baseUrl: 'https://ideahub.example.com' // 添加baseUrl以解决SEO警告
  },
  // 添加全局 CSS (如果需要，例如 RTL)
  css: [
    '~/assets/css/main.css', // 假设你有全局样式
    '~/assets/css/rtl.css'   // 全局 RTL 样式
  ],
  baseUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
})
