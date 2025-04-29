<template>
  <footer class="bg-tech-white py-10 mt-16 border-t border-tech-gray-100">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- 品牌信息 -->
        <div>
          <div class="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-primary-green mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span class="text-xl font-bold text-tech-gray-800">{{ $t('app.title') }}</span>
          </div>
          <p class="text-tech-gray-600 mb-4">{{ $t('app.footer.slogan') }}</p>
          
          <!-- 社交媒体图标 -->
          <div class="flex space-x-3 mt-4">
            <a href="https://github.com/Crash-AI-Tech/Idea" target="_blank" rel="noopener noreferrer" 
              class="w-9 h-9 rounded-full bg-tech-gray-100 flex items-center justify-center text-tech-gray-600 hover:bg-primary-green hover:text-white transition-colors duration-300" 
              aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="#" 
              class="w-9 h-9 rounded-full bg-tech-gray-100 flex items-center justify-center text-tech-gray-600 hover:bg-primary-green hover:text-white transition-colors duration-300" 
              aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" 
              class="w-9 h-9 rounded-full bg-tech-gray-100 flex items-center justify-center text-tech-gray-600 hover:bg-primary-green hover:text-white transition-colors duration-300" 
              aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <!-- 快速链接 -->
        <div>
          <h3 class="text-lg font-semibold text-tech-gray-800 mb-4">{{ $t('app.footer.quickLinks') }}</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/" class="text-tech-gray-600 hover:text-primary-green transition-all duration-200 hover:translate-x-1 inline-block">
                {{ $t('app.header.home') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/ideas/new" class="text-tech-gray-600 hover:text-primary-green transition-all duration-200 hover:translate-x-1 inline-block">
                {{ $t('idea.newTitle') }}
              </NuxtLink>
            </li>
            <li>
              <a href="#" class="text-tech-gray-600 hover:text-primary-green transition-all duration-200 hover:translate-x-1 inline-block">
                {{ $t('app.footer.discover') }}
              </a>
            </li>
            <li>
              <a href="#" class="text-tech-gray-600 hover:text-primary-green transition-all duration-200 hover:translate-x-1 inline-block">
                {{ $t('app.footer.popular') }}
              </a>
            </li>
          </ul>
        </div>
        
        <!-- 资源链接 -->
        <div>
          <h3 class="text-lg font-semibold text-tech-gray-800 mb-4">{{ $t('app.footer.resources') }}</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-tech-gray-600 hover:text-primary-green transition-all duration-200 hover:translate-x-1 inline-block">
                {{ $t('app.footer.about') }}
              </a>
            </li>
            <li>
              <a href="#" class="text-tech-gray-600 hover:text-primary-green transition-all duration-200 hover:translate-x-1 inline-block">
                {{ $t('app.footer.contact') }}
              </a>
            </li>
            <li>
              <a href="#" class="text-tech-gray-600 hover:text-primary-green transition-all duration-200 hover:translate-x-1 inline-block">
                {{ $t('app.footer.privacy') }}
              </a>
            </li>
            <li>
              <a href="#" class="text-tech-gray-600 hover:text-primary-green transition-all duration-200 hover:translate-x-1 inline-block">
                {{ $t('app.footer.terms') }}
              </a>
            </li>
          </ul>
        </div>
        
        <!-- 订阅/新建点子 -->
        <div>
          <h3 class="text-lg font-semibold text-tech-gray-800 mb-4">{{ $t('app.footer.shareCta') }}</h3>
          <p class="text-tech-gray-600 mb-4">{{ $t('app.footer.shareDescription') }}</p>
          <NuxtLink 
            to="/ideas/new" 
            class="inline-block bg-primary-green hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow"
          >
            {{ $t('app.footer.shareButton') }}
          </NuxtLink>
        </div>
      </div>
      
      <!-- 版权信息 -->
      <div class="mt-10 pt-6 border-t border-tech-gray-100 flex flex-col md:flex-row justify-between items-center">
        <p class="text-tech-gray-500 text-sm mb-2 md:mb-0">
          &copy; {{ new Date().getFullYear() }} {{ $t('app.footer.companyName') }}. {{ $t('app.footer.rights') }}
        </p>
        
        <div class="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-tech-gray-500">
          <a href="#" class="hover:text-primary-green transition-colors">{{ $t('app.footer.privacy') }}</a>
          <span class="hidden sm:inline">•</span>
          <a href="#" class="hover:text-primary-green transition-colors">{{ $t('app.footer.terms') }}</a>
          <span class="hidden sm:inline">•</span>
          <a href="#" class="hover:text-primary-green transition-colors">{{ $t('app.footer.cookies') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from '#imports'

const { t } = useI18n()
</script>

<style scoped>
/* 转换动画 */
.hover\:translate-x-1:hover {
  transform: translateX(4px);
  display: inline-block;
}
</style>
