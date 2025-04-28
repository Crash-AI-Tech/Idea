export default {
  legacy: false, // 禁用 Vue I18n Legacy API，使用 Composition API
  globalInjection: true, // 全局注入 $t 等函数
  locale: 'zh', // 默认语言
  fallbackLocale: 'en', // 当翻译缺失时使用英语作为后备语言
  messages: {} // 语言包将由 @nuxtjs/i18n 通过 langDir 配置加载
}
