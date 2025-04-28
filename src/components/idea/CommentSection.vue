<template>
  <div id="comments" class="bg-white rounded-lg shadow-sm border border-tech-gray-200 p-8">
    <h2 class="text-xl font-bold text-tech-gray-800 mb-6">{{ $t('idea.commentsTitle') }}</h2>
    
    <div v-if="comments.length === 0" class="text-center py-8 text-tech-gray-500">
      {{ $t('idea.noComments') }}
    </div>
    
    <div v-else class="space-y-6 mb-8">
      <div v-for="comment in comments" :key="comment.id" class="pb-6 border-b border-tech-gray-200 last:border-0">
        <div class="flex justify-between items-start mb-2">
          <div class="font-semibold text-tech-gray-800">{{ comment.user_id === user?.id ? $t('idea.you') : $t('idea.user') }}</div>
          <div class="text-sm text-tech-gray-500">{{ formatDate(comment.created_at) }}</div>
        </div>
        <p class="text-tech-gray-700">{{ comment.content }}</p>
      </div>
    </div>
    
    <!-- 评论输入框 -->
    <div v-if="user">
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label for="comment" class="block text-tech-gray-700 text-sm font-medium mb-2">{{ $t('idea.addComment') }}</label>
          <textarea 
            id="comment" 
            ref="commentInputRef"
            v-model="commentContent" 
            rows="3" 
            class="shadow-sm appearance-none border border-tech-gray-300 rounded-md w-full py-2 px-3 bg-tech-white text-tech-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
            :placeholder="$t('idea.addCommentPlaceholder')"
            required
          ></textarea>
        </div>
        <div class="flex justify-end">
          <button 
            type="submit" 
            class="bg-primary-green hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition duration-200 ease-in-out disabled:opacity-50"
            :disabled="commentLoading"
          >
            {{ commentLoading ? $t('common.loading') : $t('idea.submitCommentButton') }}
          </button>
        </div>
      </form>
    </div>
    
    <div v-else class="text-center py-4 border-t border-tech-gray-200 mt-6">
      <p class="text-tech-gray-600 mb-3">{{ $t('idea.loginToComment') }}</p>
      <NuxtLink to="/login" class="inline-block bg-primary-green hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition duration-200 ease-in-out">
        {{ $t('app.header.login') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '#imports'
import type { PropType } from 'vue'

const { t } = useI18n()

const props = defineProps({
  comments: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  user: {
    type: [Object, null] as PropType<any | null>,
    default: null
  },
  commentLoading: {
    type: Boolean,
    default: false
  },
  formatDate: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['submit'])
const commentContent = ref('')
const commentInputRef = ref<HTMLTextAreaElement | null>(null)

defineExpose({
  commentInputRef
})

function onSubmit() {
  console.log('CommentSection: onSubmit triggered. Emitting content:', commentContent.value);
  if (!commentContent.value.trim()) return;
  emit('submit', commentContent.value)
  commentContent.value = '';
}
</script>
