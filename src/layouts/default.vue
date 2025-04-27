<template>
  <div class="bg-tech-white min-h-screen text-tech-gray-700 flex flex-col">
    <AppNavbar />
    <main class="flex-grow">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// 页面布局使用了导航栏和页脚组件
</script>

<style>
/* 全局样式 */
body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
