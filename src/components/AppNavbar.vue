<template>
  <header class="bg-tech-white shadow-sm border-b border-tech-gray-200">
    <div class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <!-- Logo和网站名称 -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span class="text-xl font-bold text-tech-gray-800">{{ $t('app.title') }}</span>
        </NuxtLink>
        
        <!-- 导航和用户状态 -->
        <div class="flex items-center space-x-4">
          <NuxtLink 
            to="/" 
            class="text-tech-gray-600 hover:text-primary-green px-3 py-2 rounded-md transition-colors duration-200"
            active-class="text-primary-green font-medium"
            exact
          >
            {{ $t('app.header.home') }}
          </NuxtLink>
          
          <NuxtLink 
            v-if="user"
            to="/ideas/new" 
            class="text-tech-gray-600 hover:text-primary-green px-3 py-2 rounded-md transition-colors duration-200"
            active-class="text-primary-green font-medium"
          >
            {{ $t('app.header.newIdea') }}
          </NuxtLink>
          
          <!-- 语言切换器 - 放在用户账户/登录按钮的左侧 -->
          <LanguageSwitcher />
          
          <!-- 登录状态 -->
          <div v-if="!user" class="flex space-x-2">
            <NuxtLink 
              to="/login" 
              class="text-tech-gray-700 hover:text-primary-green px-3 py-2 rounded-md transition-colors duration-200"
              active-class="text-primary-green font-medium"
            >
              {{ $t('app.header.login') }}
            </NuxtLink>
            <NuxtLink 
              to="/register" 
              class="bg-primary-green hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              {{ $t('app.header.register') }}
            </NuxtLink>
          </div>
          
          <!-- 已登录 -->
          <div v-else class="relative group">
            <button 
              @click="isDropdownOpen = !isDropdownOpen"
              class="flex items-center space-x-1 text-tech-gray-700 hover:text-primary-green px-3 py-2 rounded-md transition-colors duration-200"
              :class="{'space-x-reverse': $i18n.locale === 'ar'}"
            >
              <span class="truncate max-w-[150px]">{{ user.email }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{'transform rotate-180': isDropdownOpen}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- 下拉菜单 -->
            <div 
              v-show="isDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-tech-white rounded-md shadow-lg py-1 z-50 border border-tech-gray-200"
              :class="{ 'left-0': $i18n.locale === 'ar', 'right-0': $i18n.locale !== 'ar' }"
            >
              <button 
                @click="logout"
                class="block w-full text-left px-4 py-2 text-tech-gray-700 hover:text-tech-gray-900 hover:bg-tech-gray-50"
                :class="{ 'text-right': $i18n.locale === 'ar' }"
              >
                {{ $t('app.header.logout') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from '#imports'
import { useI18n } from '#imports'
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'
import type { Database } from '~/types/supabase'

const { locale } = useI18n()
const user = useSupabaseUser()
const supabase = useSupabaseClient<Database>()
const isDropdownOpen = ref(false)

// 点击页面其他地方关闭下拉菜单
const closeDropdown = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.group')) {
    isDropdownOpen.value = false
  }
}

// 监听全局点击事件
onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

// 退出登录
const logout = async () => {
  try {
    await supabase.auth.signOut()
    isDropdownOpen.value = false
    // 无需手动导航，useSupabaseUser会自动更新状态
  } catch (error) {
    console.error('登出错误:', error)
  }
}
</script>
