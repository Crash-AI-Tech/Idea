<template>
  <div class="language-switcher relative">
    <!-- 当前语言按钮 -->
    <button 
      @click="isOpen = !isOpen"
      class="flex items-center space-x-1 text-tech-gray-700 hover:text-primary-green px-3 py-2 rounded-full transition-all duration-200 hover:-translate-y-1"
      :class="{'space-x-reverse': locale === 'ar'}"
    >
      <span class="flag-icon text-base">
        <span v-if="locale === 'zh'">🇨🇳</span>
        <span v-else-if="locale === 'en'">🇬🇧</span>
        <span v-else-if="locale === 'ar'">🇸🇦</span>
        <span v-else-if="locale === 'es'">🇪🇸</span>
      </span>
      <span class="hidden sm:inline text-sm">{{ languageNames[locale] }}</span>
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
      class="absolute mt-2 w-40 bg-tech-white rounded-lg shadow-lg py-2 z-50 border border-tech-gray-200 animate-dropdown"
      :class="locale === 'ar' ? 'right-0' : 'left-0'"
    >
      <button 
        v-for="lang in languages" 
        :key="lang.code"
        @click="switchLanguage(lang.code)"
        class="block w-full text-left px-4 py-2 text-tech-gray-700 hover:text-primary-green hover:bg-tech-gray-50 transition-colors"
        :class="[
          {'font-semibold': locale === lang.code, 'rtl-text-right': locale === 'ar'},
          locale === lang.code ? 'bg-tech-gray-50 text-primary-green' : ''
        ]"
      >
        <span class="flag-icon mr-2 text-lg">{{ lang.flag }}</span>
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
const languages = ref([
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
])

// 语言名称映射
const languageNames = ref({
  zh: '中文',
  en: 'English',
  ar: 'العربية',
  es: 'Español'
})

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

/* 下拉菜单动画 */
@keyframes dropdown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-dropdown {
  animation: dropdown 0.2s ease-out forwards;
}

.flag-icon {
  display: inline-block;
  transform: scale(1.1);
}
</style>
