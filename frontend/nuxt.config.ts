// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/supabase", "@nuxtjs/i18n"],
  supabase: {
    // URL 和 Key 会自动从 .env 文件读取
    // 我们这个简单项目不需要登录跳转，所以可以简化 redirectOptions
    redirectOptions: {
      login: "/login", // 虽然不用，但最好有个占位
      callback: "/confirm", // 同上
      exclude: ["/"], // 首页不需要认证
    },
  },
  i18n: {
    locales: [
      // 支持的语言列表
      {
        code: "en",
        iso: "en-US",
        file: "en.json", // 对应的语言文件名
        name: "English",
      },
      {
        code: "es",
        iso: "es-ES",
        file: "es.json", // 对应的语言文件名
        name: "Español",
      },
      {
        code: "zh",
        iso: "zh-CN",
        file: "zh.json",
        name: "中文",
      },
    ],
    detectBrowserLanguage: false, // 不自动检测浏览器语言
    lazy: true, // 懒加载语言文件
    langDir: "locales/", // 语言文件存放目录
    defaultLocale: "en", // 默认语言
    strategy: "prefix_except_default", // URL 策略，默认语言不带前缀，其他语言带 /en/ /es/ 等
    // vueI18n: "./i18n.options.js", // (可选) 更高级的 vue-i18n 配置
    // detectBrowserLanguage: { // (可选) 自动检测浏览器语言
    //   useCookie: true,
    //   cookieKey: 'i18n_redirected',
    //   redirectOn: 'root',  // recommended
    // }
  },
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
});
