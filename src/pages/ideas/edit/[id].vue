<template>
  <div class="container mx-auto px-4 py-8 text-center">
    <div class="mb-6">
      <p class="text-tech-gray-600">{{ $t('idea.redirectingToDetail') }}</p>
      <div class="mt-4">
        <NuxtLink :to="`/ideas/${ideaId}`" class="bg-primary-green hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md focus:outline-none transition duration-200 ease-in-out">
          {{ $t('common.back') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n, onMounted } from '#imports'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const ideaId = route.params.id

// 自动重定向到详情页面
onMounted(() => {
  router.push(`/ideas/${ideaId}`)
})
</script>
