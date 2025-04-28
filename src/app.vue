<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { watch } from '#imports'
import { useI18n, useLocaleHead } from '#imports'

// 初始化 i18n
const { locale } = useI18n()
const localeHead = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true
})

// 监听语言变化并设置方向
watch(() => locale.value, (newLocale) => {
  if (process.client) { // 确保只在客户端执行
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = newLocale
  }
}, { immediate: true })
</script>
