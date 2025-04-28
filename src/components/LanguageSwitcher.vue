<template>
  <div class="language-switcher relative">
    <!-- 当前语言按钮 -->
    <button 
      @click="isOpen = !isOpen"
      class="flex items-center space-x-1 text-tech-gray-700 hover:text-primary-green px-3 py-2 rounded-md transition-colors duration-200"
      :class="{'space-x-reverse': locale === 'ar'}"
    >
      <span v-if="locale === 'zh'" class="flag-icon">🇨🇳</span>
      <span v-else-if="locale === 'en'" class="flag-icon">🇬🇧</span>
      <span v-else-if="locale === 'ar'" class="flag-icon">🇸🇦</span>
      <span v-else-if="locale === 'es'" class="flag-icon">🇪🇸</span>
      <span class="hidden sm:inline">{{ languageNames[locale] }}</span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-4 w-4" 
        :class="{'transform rotate-180': isOpen}" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    <!-- 语言下拉菜单 -->
    <div 
      v-show="isOpen"
      class="absolute mt-2 w-36 bg-tech-white rounded-md shadow-lg py-1 z-50 border border-tech-gray-200"
      :class="locale === 'ar' ? 'right-0' : 'left-0'"
    >
      <button 
        v-for="lang in languages" 
        :key="lang.code"
        @click="switchLanguage(lang.code)"
        class="block w-full text-left px-4 py-2 text-tech-gray-700 hover:text-tech-gray-900 hover:bg-tech-gray-50"
        :class="{'font-bold': locale === lang.code, 'rtl-text-right': locale === 'ar'}"
      >
        <span class="flag-icon mr-2">{{ lang.flag }}</span>
        {{ lang.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from '#imports'
import { useI18n } from '#imports'

const { locale } = useI18n()
const isOpen = ref(false)

// 语言配置
const languages = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
]

// 语言名称映射
const languageNames = {
  zh: '中文',
  en: 'English',
  ar: 'العربية',
  es: 'Español'
}

// 切换语言
const switchLanguage = (langCode) => {
  locale.value = langCode
  isOpen.value = false
}

// 点击外部关闭下拉菜单
const closeOnClickOutside = (e) => {
  if (!e.target.closest('.language-switcher')) {
    isOpen.value = false
  }
}

// 监听全局点击事件
onMounted(() => {
  document.addEventListener('click', closeOnClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeOnClickOutside)
})
</script>

<style scoped>
.language-switcher {
  display: inline-block;
}

/* RTL 支持 */
:global([dir="rtl"]) .rtl-text-right {
  text-align: right;
}

/* 在 RTL 模式下调整 flag-icon 的边距 */
:global([dir="rtl"]) .flag-icon {
  margin-right: 0;
  margin-left: 0.5rem;
}
</style>
