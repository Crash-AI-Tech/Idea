<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 bg-tech-gray-800 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-tech-white p-6 rounded-xl shadow-xl max-w-md w-full m-4 transform transition-all duration-300 scale-in">
        <div class="text-center mb-4">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-tech-gray-800 mb-2">{{ $t('idea.deleteConfirmTitle') }}</h3>
          <p class="text-tech-gray-600">{{ $t('idea.deleteConfirmText', { title: ideaTitle }) }}</p>
        </div>
        
        <div class="flex flex-col sm:flex-row justify-center gap-3 mt-6">
          <button 
            @click="onCancel"
            class="order-2 sm:order-1 px-5 py-2.5 rounded-full border border-tech-gray-300 text-tech-gray-700 hover:bg-tech-gray-50 transition-all duration-200 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tech-gray-300"
          >
            {{ $t('idea.cancelButton') }}
          </button>
          <button 
            @click="onConfirm"
            class="order-1 sm:order-2 px-5 py-2.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-200 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm hover:shadow"
          >
            {{ $t('idea.confirmButton') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useI18n } from '#imports'

const { t } = useI18n()

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  ideaTitle: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['cancel', 'confirm'])

function onCancel() {
  emit('cancel')
}

function onConfirm() {
  emit('confirm')
}
</script>

<style scoped>
/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 缩放入场动画 */
.scale-in {
  animation: scaleIn 0.3s ease forwards;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
