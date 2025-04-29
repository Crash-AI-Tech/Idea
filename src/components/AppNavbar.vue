<template>
  <header class="bg-tech-white shadow-sm sticky top-0 z-50 border-b border-tech-gray-200 backdrop-blur-sm bg-white/95">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <!-- Logo和网站名称 -->
        <NuxtLink to="/" class="flex items-center space-x-2 transition-transform duration-300 transform hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span class="text-xl font-bold text-tech-gray-800">{{ $t('app.title') }}</span>
        </NuxtLink>
        
        <!-- 搜索框 - Pinterest风格 -->
        <div class="hidden md:block flex-grow max-w-md mx-6">
          <div class="relative">
            <input 
              type="text" 
              :placeholder="$t('app.search')" 
              class="w-full py-2 px-4 pl-10 bg-tech-gray-100 border-0 rounded-full text-tech-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-green focus:bg-white transition-all duration-200"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-tech-gray-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <!-- 导航和用户状态 -->
        <div class="flex items-center space-x-3">
          <NuxtLink 
            to="/" 
            class="text-tech-gray-600 hover:text-primary-green px-3 py-2 rounded-full transition-all duration-200 hover:-translate-y-1"
            active-class="text-primary-green font-medium"
            exact
          >
            <span class="hidden md:inline">{{ $t('app.header.home') }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
            </svg>
          </NuxtLink>
          
          <!-- 创建新点子按钮 - 只显示给登录用户 -->
          <NuxtLink 
            v-if="user"
            to="/ideas/new" 
            class="text-tech-gray-600 hover:text-primary-green px-3 py-2 rounded-full transition-all duration-200 hover:-translate-y-1 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span class="hidden md:inline ml-1">{{ $t('idea.newTitle') }}</span>
          </NuxtLink>
          
          <!-- 语言切换器 -->
          <LanguageSwitcher />
          
          <!-- 登录状态 -->
          <div v-if="!user" class="flex space-x-2 items-center">
            <NuxtLink 
              to="/login" 
              class="text-tech-gray-700 hover:text-primary-green px-3 py-2 rounded-full transition-all duration-200 hover:-translate-y-1"
              active-class="text-primary-green font-medium"
            >
              {{ $t('app.header.login') }}
            </NuxtLink>
            <NuxtLink 
              to="/register" 
              class="bg-primary-green hover:bg-green-600 text-white px-4 py-2 rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow"
            >
              {{ $t('app.header.register') }}
            </NuxtLink>
          </div>
          
          <!-- 已登录 -->
          <div v-else class="relative group">
            <button 
              @click="isDropdownOpen = !isDropdownOpen"
              class="flex items-center space-x-1 text-tech-gray-700 hover:text-primary-green px-3 py-2 rounded-full transition-all duration-200 hover:-translate-y-1"
              :class="{'space-x-reverse': $i18n.locale === 'ar'}"
            >
              <div class="w-8 h-8 bg-primary-green text-white rounded-full flex items-center justify-center font-medium">
                {{ user.email ? user.email.charAt(0).toUpperCase() : 'U' }}
              </div>
              <span class="truncate max-w-[100px] hidden md:inline">{{ user.email }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{'transform rotate-180': isDropdownOpen}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- 下拉菜单 -->
            <div 
              v-show="isDropdownOpen"
              class="absolute mt-2 w-48 bg-tech-white rounded-lg shadow-lg py-2 z-50 border border-tech-gray-200 animate-dropdown"
              :class="{ 'left-0': $i18n.locale === 'ar', 'right-0': $i18n.locale !== 'ar' }"
            >
              <div class="px-4 py-2 border-b border-tech-gray-100 mb-1">
                <div class="text-sm text-tech-gray-500 truncate">{{ user.email }}</div>
              </div>
              <NuxtLink
                to="/"
                class="block w-full text-left px-4 py-2 text-tech-gray-700 hover:text-primary-green hover:bg-tech-gray-50 transition-colors"
                :class="{ 'text-right': $i18n.locale === 'ar' }"
              >
                {{ $t('app.header.home') }}
              </NuxtLink>
              <NuxtLink
                to="/ideas/new"
                class="block w-full text-left px-4 py-2 text-tech-gray-700 hover:text-primary-green hover:bg-tech-gray-50 transition-colors"
                :class="{ 'text-right': $i18n.locale === 'ar' }"
              >
                {{ $t('idea.newTitle') }}
              </NuxtLink>
              <div class="border-t border-tech-gray-100 my-1"></div>
              <button 
                @click="logout"
                class="block w-full text-left px-4 py-2 text-tech-gray-700 hover:text-red-500 hover:bg-tech-gray-50 transition-colors"
                :class="{ 'text-right': $i18n.locale === 'ar' }"
              >
                {{ $t('app.header.logout') }}
              </button>
            </div>
          </div>
          
          <!-- 移动端搜索按钮 -->
          <button class="md:hidden text-tech-gray-600 hover:text-primary-green px-3 py-2 rounded-full transition-all duration-200 hover:-translate-y-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
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

<style scoped>
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
</style>
