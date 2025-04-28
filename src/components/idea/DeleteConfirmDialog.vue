<template>
  <div v-if="show" class="fixed inset-0 bg-tech-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-tech-white p-6 rounded-lg shadow-xl max-w-md w-full">
      <h3 class="text-lg font-semibold text-tech-gray-800 mb-3">{{ $t('idea.deleteConfirmTitle') }}</h3>
      <p class="text-tech-gray-600 mb-4">{{ $t('idea.deleteConfirmText', { title: ideaTitle }) }}</p>
      <div class="flex justify-end space-x-3">
        <button 
          @click="onCancel"
          class="px-4 py-2 rounded-md bg-tech-gray-100 text-tech-gray-700 hover:bg-tech-gray-200 transition-colors"
        >
          {{ $t('idea.cancelButton') }}
        </button>
        <button 
          @click="onConfirm"
          class="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          {{ $t('idea.confirmButton') }}
        </button>
      </div>
    </div>
  </div>
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
