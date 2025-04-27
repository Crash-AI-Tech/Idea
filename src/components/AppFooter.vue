<template>
  <footer class="bg-tech-gray-50 py-8 mt-12 border-t border-tech-gray-200">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-4 md:mb-0">
          <div class="flex items-center justify-center md:justify-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-green mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span class="text-lg font-bold text-tech-gray-800">创业点子</span>
          </div>
          <p class="text-tech-gray-600 mt-2 text-center md:text-left">分享你的创业灵感，连接创新思维</p>
        </div>
        
        <div class="text-center md:text-right">
          <p class="text-tech-gray-600">&copy; {{ new Date().getFullYear() }} 创业点子. 保留所有权利.</p>
        </div>
      </div>
    </div>
  </footer>
</template>
