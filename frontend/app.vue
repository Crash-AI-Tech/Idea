<template>
  <div id="app-container">
    <header class="app-header">
      <h1>💡 {{ $t("pageTitle") }}</h1>
      <LanguageSwitcher />
    </header>

    <!-- 这里使用 NuxtPage 来渲染当前路由对应的页面 -->
    <main class="app-main">
      <NuxtPage />
    </main>

    <footer class="app-footer">
      <p>
        {{ $t("footer.copyright", { year: new Date().getFullYear() }) }}
      </p>
    </footer>
  </div>
</template>

<script setup>
import LanguageSwitcher from "~/components/LanguageSwitcher.vue";
</script>

<style>
/* 保留全局样式和布局样式 */
:root {
--primary-color: #28a745; /* 明亮的绿色 */
  --primary-hover-color: #1e7e34; /* 主色调的深色悬停状态 */
  --secondary-color: #6c757d; /* 保持不变，或选择一个与绿色搭配的颜色，如深灰色 */
  --background-color: #f8f9fa;
  --card-background-color: #ffffff;
  --text-color: #343a40;
  --light-text-color: #ffffff;
  --border-color: #dee2e6;
  --success-color: #28a745; /* 与主色调相同，或选择一个略有区别的成功绿色 */
  --error-color: #dc3545;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  --border-radius: 8px;
  --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  --input-focus-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25); /* 绿色调的聚焦阴影 */
}

#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: var(--font-family);
  line-height: 1.6;
}

.app-header {
  background-color: var(--primary-color);
  color: var(--light-text-color);
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
}

.app-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
}

.app-main {
  flex-grow: 1;
  padding: 2rem;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
}

.app-footer {
  background-color: #343a40;
  color: #adb5bd;
  text-align: center;
  padding: 1.5rem 2rem;
  margin-top: auto;
}

.app-footer p {
  margin: 0;
  font-size: 0.9rem;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .app-header h1 {
    font-size: 1.5rem;
  }
  .app-main {
    padding: 1rem;
  }
}
</style>